import React from 'react';

const riskColor = (risk) => {
  if (risk === 'high') return 'bg-red-500';
  if (risk === 'medium') return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function ClauseList({ clauses = [], selectedId, onSelect }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold mb-2">Clauses</h3>
      <div className="max-h-[60vh] overflow-auto">
        {clauses.map((c) => (
          <div key={c.id} onClick={() => onSelect(c.id)} className={`p-3 rounded cursor-pointer flex items-start gap-3 ${selectedId === c.id ? 'bg-gray-100' : ''}`}>
            <div className={`w-3 h-3 rounded-full mt-1 ${riskColor(c.risk)}`}></div>
            <div>
              <div className="font-medium">Clause #{c.id}</div>
              <div className="text-sm text-gray-600">{c.text.slice(0, 80)}{c.text.length > 80 ? '...' : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
