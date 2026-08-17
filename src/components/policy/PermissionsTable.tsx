import React from 'react';

export interface PermissionItem {
  name: string;
  scenario: string;
  impact: string;
}

export const PermissionsTable: React.FC<{ items: PermissionItem[] }> = ({ items }) => {
  return (
    <div className="overflow-x-auto my-6 rounded-lg border border-slate-200 shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">权限名称 (Permission)</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">调用场景 (Scenario)</th>
            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">拒绝影响 (Impact)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-200">
          {items.map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
              <td className="px-6 py-4 text-sm font-medium text-slate-900">{item.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600">{item.scenario}</td>
              <td className="px-6 py-4 text-sm text-red-500">{item.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};