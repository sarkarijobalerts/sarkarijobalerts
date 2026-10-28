export default function JobPostingSchema({ post }) {
  if (!post) return null;

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

  // Dynamic job location: use post data or default to India-wide
  const jobLocationData = (() => {
    const addressObj = {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    };
    if (post.jobCity && post.jobCity.trim()) {
      addressObj.addressLocality = post.jobCity.trim();
    }
    addressObj.addressRegion = (post.jobState && post.jobState.trim()) || 'All India';

    return {
      '@type': 'Place',
      address: addressObj,
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
