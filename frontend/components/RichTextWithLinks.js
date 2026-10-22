import React from 'react';
import Link from 'next/link';
import seedPosts from '../lib/seedPosts.json';

// Build the dictionary of keywords and their corresponding URLs.
// We use primaryKeyword if available, otherwise fallback to the organization name or part of the title.
const keywordMap = [];

seedPosts.forEach((post) => {
  if (!post.slug) return;
  const url = `/job/${post.slug}/`;
  
  // Use primary keyword if present
  if (post.primaryKeyword) {
    keywordMap.push({ keyword: post.primaryKeyword, url });
  }
  
  // Also add the organization name as a keyword if it's long enough
  if (post.organizationName && post.organizationName.length > 10) {
    keywordMap.push({ keyword: post.organizationName, url });
  }
  
  // Add common abbreviations / shortened titles
  if (post.postName && post.postName.length > 5 && post.postName.length < 50) {
    keywordMap.push({ keyword: post.postName, url });
  }
});

// Sort by length descending so longer phrases match first
keywordMap.sort((a, b) => b.keyword.length - a.keyword.length);

// Escape regex special characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function RichTextWithLinks({ text, currentSlug }) {
  if (!text || typeof text !== 'string') return null;

  // We only want to link the FIRST occurrence of any keyword in this block of text to avoid spamming links.
  const linkedUrls = new Set();
  
  // Prevent linking to the current page itself
  if (currentSlug) {
    linkedUrls.add(`/job/${currentSlug}/`);
  }

  // We will build an array of string segments and Link components.
  let elements = [text];

  for (const { keyword, url } of keywordMap) {
    if (linkedUrls.has(url)) continue; // Only link a URL once per text block

    const regex = new RegExp(`\\b(${escapeRegExp(keyword)})\\b`, 'i');
    
    let newElements = [];
    let matchFound = false;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (typeof element === 'string') {
        const parts = element.split(regex);
        if (parts.length > 1 && !matchFound) {
          // A match is found. Parts will be like: [before, match, after]
          // But wait, split with capture group returns all parts. 
          // However, we only want to link the FIRST match in the entire text.
          for (let j = 0; j < parts.length; j++) {
            if (j % 2 === 1 && !matchFound) {
              // This is a matched keyword
              newElements.push(
                <Link
                  key={`${url}-${j}`}
                  href={url}
                  className="text-cyan-400 font-bold hover:text-cyan-300 underline underline-offset-2 transition-colors"
                  title={`View details for ${parts[j]}`}
                >
                  {parts[j]}
                </Link>
              );
              matchFound = true;
              linkedUrls.add(url);
            } else {
              if (parts[j]) {
                newElements.push(parts[j]);
              }
            }
          }
        } else {
          newElements.push(element);
        }
      } else {
        newElements.push(element);
      }
    }
    elements = newElements;
  }

  return (
    <React.Fragment>
      {elements.map((el, i) => (
        <React.Fragment key={i}>{el}</React.Fragment>
      ))}
    </React.Fragment>
  );
}
