// components/forms/TermsScroller.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface TermsScrollerProps {
  htmlFilePath: string; // Path to your HTML file, e.g., '/assets/terms-and-conditions.html'
}

const TermsScroller: React.FC<TermsScrollerProps> = ({ htmlFilePath }) => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await fetch(htmlFilePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch terms: ${response.statusText}`);
        }
        const text = await response.text();
        setHtmlContent(text);
      } catch (err: unknown) {
        console.error("Error fetching terms:", err);
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while loading terms.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [htmlFilePath]); // Re-fetch if the file path changes

  if (loading) {
    return <div className="terms-container">Loading terms...</div>;
  }

  if (error) {
    return <div className="terms-container error-message">Error: {error}</div>;
  }

  return (
    <div className="terms-container">
      <div className="terms-scroll-box" dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default TermsScroller;
