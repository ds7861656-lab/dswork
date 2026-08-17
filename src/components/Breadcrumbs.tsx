import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="px-8 py-4 bg-gray-50 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <li className="text-gray-400">/</li>}
              <li>
                {item.href ? (
                  <Link to={item.href} className="text-gray-500 hover:text-gray-700">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-700 font-medium truncate max-w-xs">{item.label}</span>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumbs;