import { GoogleGenAI, Type } from '@google/genai';
import slugify from 'slugify';

/**
 * Structured Response Schema matching Google Gen AI SDK (Type enum)
 * AdSense Compliance: Generates 600+ words of structured, unique original analysis.
 */
export const jobPostResponseSchema = {
  type: Type.OBJECT,
  properties: {
    seo: {
      type: Type.OBJECT,
      properties: {
        metaTitle: { type: Type.STRING },
        metaDescription: { type: Type.STRING },
        slug: { type: Type.STRING },
        primaryKeyword: { type: Type.STRING },
      },
      required: ['metaTitle', 'metaDescription', 'slug', 'primaryKeyword'],
    },
    jobDetails: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        shortInfo: { type: Type.STRING },
        organizationName: { type: Type.STRING },
        postName: { type: Type.STRING },
        totalVacancies: { type: Type.STRING },
        expertTake: { type: Type.STRING, description: '150+ words unique summary and expert take as career counselor' },
        selectionProcess: { type: Type.STRING, description: 'Detailed breakdown of examination stages and selection process' },
        preparationStrategy: { type: Type.STRING, description: '200+ words detailed syllabus breakdown and preparation strategy' },
        importantDates: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              eventName: { type: Type.STRING },
              dateValue: { type: Type.STRING },
            },
            required: ['eventName', 'dateValue'],
          },
        },
        applicationFee: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              amount: { type: Type.STRING },
            },
            required: ['category', 'amount'],
          },
        },
        ageLimit: {
          type: Type.OBJECT,
          properties: {
            minAge: { type: Type.STRING },
            maxAge: { type: Type.STRING },
            asOnDate: { type: Type.STRING },
            relaxationInfo: { type: Type.STRING },
          },
        },
        vacanciesTable: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              postName: { type: Type.STRING },
              totalPost: { type: Type.STRING },
              eligibility: { type: Type.STRING },
            },
            required: ['postName', 'totalPost', 'eligibility'],
          },
        },
        howToApply: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: '150+ words ordered step-by-step application guide detailing documents (photos, signatures, certificates)',
        },
        faqs: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
            },
            required: ['question', 'answer'],
          },
          description: '3-4 unique FAQs addressing candidate queries (final year eligibility, negative marking, documents required)',
        },
        importantLinks: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              url: { type: Type.STRING },
            },
            required: ['label', 'url'],
          },
        },
      },
      required: ['title', 'shortInfo', 'importantDates', 'applicationFee', 'vacanciesTable', 'importantLinks'],
    },
  },
  required: ['seo', 'jobDetails'],
};

const systemPrompt = `Target: sarkarijobalerts.com Post Database
Task: Read the raw factual data (job title, dates, eligibility) for this government notification. Generate a 600+ word, highly structured HTML article / structured JSON record.
Constraint: DO NOT copy standard government phrasing. Write as a helpful career counselor giving advice to a candidate. Create unique paragraphs for the "Selection Process", "Preparation Strategy & Syllabus Breakdown", and "Expert Take". Output must include a descriptive intro, factual data for dates/fees, an ordered step-by-step list for how to apply (detailing photos, signatures, certificates), and 3-4 unique FAQs addressing candidate concerns (e.g. final year eligibility, negative marking, document prep). Keep all factual dates, fees, and links 100% accurate. Avoid AI clichés (e.g. "delve", "testament", "realm", "pivotal milestone").`;

/**
 * Process raw scraped job posting text using Gemini API with exact responseSchema.
 */
export async function processScrapedDataWithGemini(rawScrapedText) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes('your_gemini_api_key')) {
    console.warn('[Gemini AI Warning] API key missing. Generating structured fallback.');
    return generateFallbackStructuredData(rawScrapedText);
  }

  const ai = new GoogleGenAI({ apiKey });

  const inputContent = typeof rawScrapedText === 'object' ? JSON.stringify(rawScrapedText) : rawScrapedText;

  const maxAttempts = 2;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const generatePromise = ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Process this raw scraped job notification for sarkarijobalerts.com:\n\n${inputContent}` }],
          },
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: jobPostResponseSchema,
          temperature: 0.2,
        },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout (50s exceeded)')), 50000)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const structuredData = JSON.parse(response.text);

      // Sanitize slug
      if (structuredData?.seo?.slug) {
        structuredData.seo.slug = slugify(structuredData.seo.slug, { lower: true, strict: true });
      }

      return structuredData;
    } catch (error) {
      console.error(`[Gemini API Error] Attempt ${attempt}/${maxAttempts} failed:`, error.message);
      if (attempt < maxAttempts) {
        console.log('[Gemini AI] Retrying in 3 seconds...');
        await new Promise((res) => setTimeout(res, 3000));
      } else {
        return generateFallbackStructuredData(rawScrapedText);
      }
    }
  }
}

/**
 * Fallback structured JSON payload adhering strictly to jobPostResponseSchema
 */
function generateFallbackStructuredData(rawScrapedData) {
  const isObj = typeof rawScrapedData === 'object' && rawScrapedData !== null;
  const rawTitle = isObj ? rawScrapedData.title || 'Official Job Notification' : 'Official Job Notification';
  const cleanSlug = slugify(rawTitle, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);
  const orgName = isObj ? rawScrapedData.organization || 'Government Recruitment Board' : 'Recruitment Board';

  return {
    seo: {
      metaTitle: `${rawTitle.substring(0, 50)} | Sarkari Alert`,
      metaDescription: `Check ${rawTitle} eligibility, important dates, fees, and official direct application links.`,
      slug: cleanSlug,
      primaryKeyword: rawTitle.split(' ').slice(0, 3).join(' '),
    },
    jobDetails: {
      title: `${rawTitle} Notification Released`,
      shortInfo: isObj ? rawScrapedData.shortInfo || 'Official notification out.' : 'Official notification out.',
      organizationName: orgName,
      postName: rawTitle,
      totalVacancies: 'Various Posts',
      expertTake: `The ${orgName} has announced the 2026 recruitment drive for ${rawTitle}. Based on previous recruitment cycles, this is a highly competitive examination attracting aspirants from across the country. Candidates are strongly advised to begin preparation early, understand the marking scheme, and submit applications well before the closing date.`,
      selectionProcess: `The selection process typically comprises a Computer-Based Test (CBT), followed by Document Verification (DV), Skill/Physical Test (where applicable), and a Pre-Employment Medical Examination.`,
      preparationStrategy: `Candidates should allocate substantial preparation time to mastering Quantitative Aptitude, General Intelligence & Reasoning, and General Awareness. Regularly solving previous year question papers and taking full-length mock tests under timed conditions will significantly improve accuracy and time management.`,
      importantDates: isObj && rawScrapedData.importantDates ? rawScrapedData.importantDates.map(d => ({ eventName: d.title || d.eventName || 'Date', dateValue: d.dateVal || d.dateValue || 'Refer PDF' })) : [
        { eventName: 'Application Start', dateValue: 'Refer Official PDF' },
        { eventName: 'Last Date', dateValue: 'Refer Official PDF' },
      ],
      applicationFee: isObj && rawScrapedData.applicationFee ? rawScrapedData.applicationFee.map(f => ({ category: f.category || 'General/OBC', amount: f.feeVal || f.amount || 'As per rules' })) : [
        { category: 'General / OBC / EWS', amount: '₹ 100 / As per Rules' },
        { category: 'SC / ST / Reserved', amount: '₹ 0' },
      ],
      ageLimit: {
        minAge: '18 Years',
        maxAge: '35 Years',
        asOnDate: 'As per Notification Rules',
        relaxationInfo: 'Age relaxation applicable for reserved categories as per government rules.',
      },
      vacanciesTable: isObj && rawScrapedData.vacancyDetails ? rawScrapedData.vacancyDetails.map(v => ({ postName: v.postName || rawTitle, totalPost: v.totalPosts || v.totalPost || 'Various', eligibility: v.eligibility || 'Degree / Diploma' })) : [
        { postName: rawTitle, totalPost: 'Various', eligibility: 'Passed 10th / 12th / Degree from recognized institution' },
      ],
      howToApply: [
        'Prepare all prerequisite scanned documents: color passport photograph with white background, clear signature, educational marksheets, and category certificates.',
        'Visit the official recruitment portal via the direct link provided below.',
        'Complete the One-Time Registration (OTR) with an active mobile number and email ID.',
        'Fill in personal, educational, and communication details accurately as per your Matriculation certificate.',
        'Upload scanned documents matching the prescribed dimensions and file size.',
        'Verify all entered information carefully via the application preview screen before final submission.',
        'Pay the examination fee online using Debit Card, Credit Card, Net Banking, or UPI.',
        'Download and print copies of the final submitted application form and payment receipt for document verification.',
      ],
      faqs: [
        {
          question: `Can final year students apply for ${rawTitle}?`,
          answer: `Candidates must possess the requisite educational qualification on or before the crucial date specified in the official notification. Candidates awaiting final results should check the cutoff date in the official PDF.`,
        },
        {
          question: `Is there negative marking in the ${rawTitle} exam?`,
          answer: `Most central and state recruitment exams deduct 0.25 (1/4th) marks for each incorrect objective response. Check the notification exam pattern for confirmation.`,
        },
        {
          question: `What documents are required for ${rawTitle} online application?`,
          answer: `Keep a passport photo, signature, 10th/12th/Degree certificates, valid government photo ID (Aadhaar/PAN/Voter ID), and caste/EWS certificate (if applicable) ready.`,
        },
      ],
      importantLinks: isObj && rawScrapedData.officialLinks ? rawScrapedData.officialLinks.map(l => ({ label: l.linkTitle || l.label || 'Official Link', url: l.url })) : [
        { label: 'Official Website / Apply Link', url: isObj && rawScrapedData.sourceUrl ? rawScrapedData.sourceUrl : 'https://sarkariresult.com' },
      ],
    },
  };
}
