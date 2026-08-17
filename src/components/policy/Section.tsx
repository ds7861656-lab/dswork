import React from 'react';

interface SectionProps {
  title?: string;
  id?: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, id, children }) => {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      {title && (
        <h2 className="text-2xl font-bold text-slate-800 mb-4 border-l-4 border-blue-500 pl-4">
          {title}
        </h2>
      )}
      <div className="text-slate-600 leading-relaxed space-y-4 text-base">
        {children}
      </div>
    </section>
  );
};

export const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-6 mb-2">
    <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
    <div className="text-slate-600">{children}</div>
  </div>
);