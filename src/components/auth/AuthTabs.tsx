import React from 'react';
import { Smartphone, Mail } from 'lucide-react';

export type LoginMethod = 'phone' | 'email' | 'qr';

interface AuthTabsProps {
  activeMethod: LoginMethod;
  onChange: (method: LoginMethod) => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeMethod, onChange }) => {
   const tabs = [
     { id: 'phone', label: '手机验证', icon: Smartphone },
     { id: 'email', label: '邮箱验证', icon: Mail },
   ] as const;

  return (
    <div className="flex p-1 space-x-1 bg-gray-100/80 rounded-xl mb-8">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeMethod === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as LoginMethod)}
            className={`
              flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              ${isActive
                ? 'bg-white text-teal-700 shadow-sm ring-1 ring-black/5'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }
            `}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default AuthTabs;