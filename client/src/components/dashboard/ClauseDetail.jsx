import React from 'react';

export default function ClauseDetail({ clause }) {
  if (!clause) return <div className="text-gray-500">No clause selected</div>;

  const explanation = 'Plain-English explanation of the clause goes here. This is a mocked summary.';
  const suggestions = ['Consider negotiating the access window', 'Clarify renewal terms in writing.'];

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Clause #{clause.id}</h2>
      <div className="mb-4 text-gray-800">{clause.text}</div>

      <section className="mb-4">
        <h4 className="font-semibold">Explanation</h4>
        <p className="text-sm text-gray-600">{explanation}</p>
      </section>

      <section>
        <h4 className="font-semibold">Suggestions</h4>
        <ul className="list-disc pl-5 text-sm text-gray-600">
          {suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      </section>
    </div>
  );
}
