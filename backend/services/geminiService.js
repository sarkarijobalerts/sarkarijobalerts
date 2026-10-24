import { GoogleGenAI, Type } from '@google/genai';
import slugify from 'slugify';

/**
 * Structured Response Schema matching Google Gen AI SDK (Type enum)
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

const systemPrompt = `You are an expert Technical SEO Specialist and Government Job Content Writer.
YOUR TASK: Analyze raw scraped job text and output structured, unique, SEO-friendly JSON.
STRICT RULES: Keep all dates, fees, vacancies, eligibility, and URLs 100% accurate. Rewrite shortInfo, titles, and steps to be 100% unique and human-like without AI buzzwords (e.g., avoid "delve", "testament", "realm", "crucial milestone").`;

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

  try {
    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Process this raw scraped job posting:\n\n${inputContent}` }],
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
      setTimeout(() => reject(new Error('Gemini API timeout (35s exceeded)')), 35000)
    );

    const response = await Promise.race([generatePromise, timeoutPromise]);
    const structuredData = JSON.parse(response.text);

    // Sanitize slug
    if (structuredData?.seo?.slug) {
      structuredData.seo.slug = slugify(structuredData.seo.slug, { lower: true, strict: true });
    }

    return structuredData;
  } catch (error) {
    console.error('[Gemini API Error] Failed to generate structured content:', error.message);
    return generateFallbackStructuredData(rawScrapedText);
  }
}

/**
 * Fallback structured JSON payload adhering strictly to jobPostResponseSchema
 */
function generateFallbackStructuredData(rawScrapedData) {
  const isObj = typeof rawScrapedData === 'object' && rawScrapedData !== null;
  const rawTitle = isObj ? rawScrapedData.title || 'Official Job Notification' : 'Official Job Notification';
  const cleanSlug = slugify(rawTitle, { lower: true, strict: true }) + '-' + Date.now().toString().slice(-4);

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
      organizationName: isObj ? rawScrapedData.organization || 'Government Recruitment Board' : 'Recruitment Board',
      postName: rawTitle,
      totalVacancies: 'Various Posts',
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
        'Visit the official recruitment website link listed below.',
        'Read the detailed official notification PDF carefully.',
        'Fill in required personal, academic, and document details in the online form.',
        'Pay application fee if applicable and submit the form.',
        'Take a printout of the submitted application form for future reference.',
      ],
      importantLinks: isObj && rawScrapedData.officialLinks ? rawScrapedData.officialLinks.map(l => ({ label: l.linkTitle || l.label || 'Official Link', url: l.url })) : [
        { label: 'Official Website / Apply Link', url: isObj && rawScrapedData.sourceUrl ? rawScrapedData.sourceUrl : 'https://sarkariresult.com' },
      ],
    },
  };
}
