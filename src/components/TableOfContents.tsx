import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TableOfContents: React.FC<{ headings: { id: string; text: string; level: number }[] }> = ({ headings }) => {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(({ id }) => document.getElementById(id));

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setActiveId(element.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-20 bg-white p-4 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4">{t('blog.tableOfContents')}</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 16}px` }}>
            <a
              href={`#${heading.id}`}
              className={`block py-1 text-sm transition-colors ${
                activeId === heading.id
                  ? 'text-teal-600 font-medium'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;