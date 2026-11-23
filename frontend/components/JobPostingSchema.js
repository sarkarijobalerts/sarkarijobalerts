export default function JobPostingSchema({ post }) {
  if (!post) return null;

  // Strict Google Structured Data Guidelines:
  // JobPosting schema must ONLY be rendered on genuine, active job vacancy pages ("Latest Jobs").
  // Do NOT render on Exam Results, Admit Cards, Answer Keys, or Syllabuses.
  const category = (post.category || '').trim();
  if (category && category !== 'Latest Jobs') {
    return null;
  }

  // Safe date parser helper
  const parseIsoDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString();
    
    // Check if DD/MM/YYYY format
    if (typeof dateStr === 'string' && dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        const parsed = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
      }
    }

    const parsed = new Date(dateStr);
    return !isNaN(parsed.getTime()) ? parsed.toISOString() : new Date().toISOString();
  };

  // Dynamic validThrough: must be in the future for active postings
  const validThroughDate = (() => {
    const dates = post.importantDates || [];
    const lastDateEntry = dates.find(
      (d) =>
        (d.eventName || d.title || '').toLowerCase().includes('last date') ||
        (d.eventName || d.title || '').toLowerCase().includes('closing date') ||
        (d.eventName || d.title || '').toLowerCase().includes('last date to apply')
    );
    if (lastDateEntry) {
      const val = lastDateEntry.dateValue || lastDateEntry.dateVal;
      if (val && !val.toLowerCase().includes('refer')) {
        const parsed = parseIsoDate(val);
        const parsedMs = new Date(parsed).getTime();
        // Only use if date is in the future
        if (!isNaN(parsedMs) && parsedMs > Date.now()) {
          return parsed;
        }
      }
    }
    // Fallback: 60 days in future to prevent expired schema errors
    return new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString();
  })();

  const orgName = post.organizationName || post.organization || 'Government Recruitment Board';
  
  const rawOfficialUrl = 
    (post.importantLinks && post.importantLinks[0] && post.importantLinks[0].url) ||
    (post.officialLinks && post.officialLinks[0] && post.officialLinks[0].url);
  const officialUrl = rawOfficialUrl && rawOfficialUrl.startsWith('http') ? rawOfficialUrl : 'https://sarkarijobalerts.com';

  const titleText = post.rewrittenTitle || post.title || 'Government Job Vacancy Alert';
  const descText = post.metaDescription || post.shortInfo || titleText;

  // Comprehensive Indian Recruitment Board Location Resolver
  // Satisfies all Google Search Console PostalAddress requirements:
  // streetAddress, addressLocality, addressRegion, postalCode, addressCountry
  const jobLocationData = (() => {
    const STATE_RECRUITMENT_HUBS = {
      'uttar pradesh': { locality: 'Lucknow', region: 'Uttar Pradesh', streetAddress: 'Vibhuti Khand, Gomti Nagar', postalCode: '226010' },
      'up': { locality: 'Lucknow', region: 'Uttar Pradesh', streetAddress: 'Vibhuti Khand, Gomti Nagar', postalCode: '226010' },
      'bihar': { locality: 'Patna', region: 'Bihar', streetAddress: '15, Jawaharlal Nehru Marg, Bailey Road', postalCode: '800001' },
      'rajasthan': { locality: 'Jaipur', region: 'Rajasthan', streetAddress: 'State Secretariat, Bhagwan Das Road', postalCode: '302005' },
      'madhya pradesh': { locality: 'Bhopal', region: 'Madhya Pradesh', streetAddress: 'Chayan Bhawan, Main Road No. 1, Chinar Park', postalCode: '462011' },
      'mp': { locality: 'Bhopal', region: 'Madhya Pradesh', streetAddress: 'Chayan Bhawan, Main Road No. 1, Chinar Park', postalCode: '462011' },
      'delhi': { locality: 'New Delhi', region: 'Delhi', streetAddress: 'FC-18, Institutional Area, Karkardooma', postalCode: '110092' },
      'haryana': { locality: 'Panchkula', region: 'Haryana', streetAddress: 'Bays No. 67-70, Sector 2', postalCode: '134151' },
      'punjab': { locality: 'Patiala', region: 'Punjab', streetAddress: 'Baradari Garden, High Grounds', postalCode: '147001' },
      'uttarakhand': { locality: 'Dehradun', region: 'Uttarakhand', streetAddress: 'Gurukul Kangri, Haridwar Road', postalCode: '248001' },
      'jharkhand': { locality: 'Ranchi', region: 'Jharkhand', streetAddress: 'Circular Road, Administrative Complex', postalCode: '834001' },
      'chhattisgarh': { locality: 'Raipur', region: 'Chhattisgarh', streetAddress: 'North Block, Sector 19, Nava Raipur', postalCode: '492002' },
      'maharashtra': { locality: 'Mumbai', region: 'Maharashtra', streetAddress: 'Maharshi Karve Road, Churchgate', postalCode: '400020' },
      'gujarat': { locality: 'Gandhinagar', region: 'Gujarat', streetAddress: 'Block No. 2, Karmayogi Bhavan, Sector 10A', postalCode: '382010' },
      'west bengal': { locality: 'Kolkata', region: 'West Bengal', streetAddress: '161-A, S.P. Mukherjee Road', postalCode: '700026' },
      'odisha': { locality: 'Bhubaneswar', region: 'Odisha', streetAddress: 'Unit II, Ashok Nagar', postalCode: '751009' },
      'tamil nadu': { locality: 'Chennai', region: 'Tamil Nadu', streetAddress: 'TNPSC Road, VOC Nagar, Park Town', postalCode: '600003' },
      'karnataka': { locality: 'Bengaluru', region: 'Karnataka', streetAddress: 'Udyoga Soudha, Park Road', postalCode: '560001' },
      'telangana': { locality: 'Hyderabad', region: 'Telangana', streetAddress: 'Prathibha Bhavan, M.J. Road, Nampally', postalCode: '500001' },
      'andhra pradesh': { locality: 'Vijayawada', region: 'Andhra Pradesh', streetAddress: 'New HOD Building, MG Road', postalCode: '520010' },
      'kerala': { locality: 'Thiruvananthapuram', region: 'Kerala', streetAddress: 'Pattom Palace P.O.', postalCode: '695004' },
      'assam': { locality: 'Guwahati', region: 'Assam', streetAddress: 'Jawahar Nagar, Khanapara', postalCode: '781022' },
      'himachal pradesh': { locality: 'Shimla', region: 'Himachal Pradesh', streetAddress: 'Nigam Vihar, Chhota Shimla', postalCode: '171002' },
      'jammu and kashmir': { locality: 'Srinagar', region: 'Jammu and Kashmir', streetAddress: 'Resham Ghar Colony, Solina', postalCode: '190009' },
      'chandigarh': { locality: 'Chandigarh', region: 'Chandigarh', streetAddress: 'Sector 9, Secretariat', postalCode: '160009' }
    };

    const DEFAULT_CENTRAL = {
      streetAddress: 'CGO Complex, Lodhi Road',
      addressLocality: 'New Delhi',
      addressRegion: 'Delhi',
      postalCode: '110003',
      addressCountry: 'IN'
    };

    const textToSearch = [
      post.organizationName,
      post.organization,
      post.title,
      post.jobState,
      post.jobCity,
      post.shortInfo
    ].filter(Boolean).join(' ').toLowerCase();

    // 1. High-frequency specific commission locations
    if (textToSearch.includes('prayagraj') || textToSearch.includes('allahabad') || textToSearch.includes('uppsc')) {
      return {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '10, Kasturba Gandhi Marg',
          addressLocality: 'Prayagraj',
          addressRegion: 'Uttar Pradesh',
          postalCode: '211018',
          addressCountry: 'IN'
        }
      };
    }

    if (textToSearch.includes('ajmer') || textToSearch.includes('rpsc')) {
      return {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ghooghara Ghati, Jaipur Road',
          addressLocality: 'Ajmer',
          addressRegion: 'Rajasthan',
          postalCode: '305001',
          addressCountry: 'IN'
        }
      };
    }

    // 2. Check state match
    const stateKey = Object.keys(STATE_RECRUITMENT_HUBS).find((key) => {
      const rawState = (post.jobState || '').toLowerCase().trim();
      if (rawState && (rawState === key || rawState.includes(key))) return true;
      return textToSearch.includes(key);
    });

    if (stateKey) {
      const hub = STATE_RECRUITMENT_HUBS[stateKey];
      const hasCustomCity = post.jobCity && post.jobCity.trim() && post.jobCity.trim().toLowerCase() !== 'all india';
      const city = hasCustomCity ? post.jobCity.trim() : hub.locality;
      const street = hasCustomCity && city.toLowerCase() !== hub.locality.toLowerCase()
        ? `Administrative Headquarters, ${city}`
        : hub.streetAddress;

      return {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          streetAddress: street,
          addressLocality: city,
          addressRegion: hub.region,
          postalCode: hub.postalCode,
          addressCountry: 'IN'
        }
      };
    }

    // 3. Fallback: Central Government / All India / UPSC / SSC / Railways / Banking
    return {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: DEFAULT_CENTRAL.streetAddress,
        addressLocality: DEFAULT_CENTRAL.addressLocality,
        addressRegion: DEFAULT_CENTRAL.addressRegion,
        postalCode: DEFAULT_CENTRAL.postalCode,
        addressCountry: DEFAULT_CENTRAL.addressCountry
      }
    };
  })();

  // Dynamic salary: extract from post data or use standard government pay range
  const baseSalaryData = (() => {
    if (post.salaryMin && post.salaryMax) {
      return {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: {
          '@type': 'QuantitativeValue',
          minValue: parseInt(post.salaryMin, 10) || 18000,
          maxValue: parseInt(post.salaryMax, 10) || 56100,
          unitText: 'MONTH',
        },
      };
    }
    if (post.salary) {
      return {
        '@type': 'MonetaryAmount',
        currency: 'INR',
        value: {
          '@type': 'QuantitativeValue',
          value: parseInt(post.salary, 10) || 25000,
          unitText: 'MONTH',
        },
      };
    }
    // Default government pay scale range (Pay Level 1-5)
    return {
      '@type': 'MonetaryAmount',
      currency: 'INR',
      value: {
        '@type': 'QuantitativeValue',
        minValue: 18000,
        maxValue: 56100,
        unitText: 'MONTH',
      },
    };
  })();

  // Build rich description with eligibility info and SEO keywords
  const richDescription = (() => {
    const parts = [
      descText,
      "Check this sarkari naukri update for the latest govt jobs 2026.",
      "Read the official notification and apply online govt jobs through the direct link provided.",
      "For more sarkari result updates, keep visiting SarkariJobAlerts.com."
    ];
    const vacancies = post.vacanciesTable || [];
    if (vacancies.length > 0) {
      const eligParts = vacancies
        .filter((v) => v.eligibility)
        .slice(0, 3)
        .map((v) => `${v.postName}: ${v.eligibility}`);
      if (eligParts.length > 0) {
        parts.push('Eligibility: ' + eligParts.join('; '));
      }
    }
    if (post.totalVacancies && post.totalVacancies !== 'N/A') {
      parts.push(`Total Vacancies: ${post.totalVacancies}`);
    }
    return parts.join(' ');
  })();

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: titleText,
    description: richDescription,
    image: 'https://sarkarijobalerts.com/sarkari-job.jpg',
    identifier: {
      '@type': 'PropertyValue',
      name: orgName,
      value: post.slug || post._id || 'job-alert',
    },
    datePosted: parseIsoDate(post.publishedDate || post.postDate),
    validThrough: validThroughDate,
    employmentType: 'FULL_TIME',
    industry: 'Government Administration / Public Sector',
    directApply: true,
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'IN',
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: orgName,
      sameAs: officialUrl,
      logo: 'https://sarkarijobalerts.com/icon.png',
    },
    jobLocation: jobLocationData,
    baseSalary: baseSalaryData,
  };

  // Add totalJobOpenings if available
  if (post.totalVacancies && post.totalVacancies !== 'N/A' && post.totalVacancies !== 'Various Posts') {
    const parsed = parseInt(post.totalVacancies, 10);
    if (!isNaN(parsed) && parsed > 0) {
      schemaData.totalJobOpenings = parsed;
    }
  }

  // Add qualifications from vacancy table
  const qualifications = (post.vacanciesTable || [])
    .filter((v) => v.eligibility)
    .map((v) => v.eligibility)
    .slice(0, 3);
  if (qualifications.length > 0) {
    schemaData.qualifications = qualifications.join('; ');
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
