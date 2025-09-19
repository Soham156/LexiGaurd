import React, { useContext, useState } from 'react';
import { DocumentContext } from '../context/DocumentContext';
import ClauseList from '../components/dashboard/ClauseList';
import ClauseDetail from '../components/dashboard/ClauseDetail';
import ChatPanel from '../components/dashboard/ChatPanel';

export default function DashboardPage() {
  const { clauses } = useContext(DocumentContext);
  const [selectedId, setSelectedId] = useState(clauses?.[0]?.id ?? null);

  const selected = clauses.find((c) => c.id === selectedId) || clauses[0] || null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        <aside className="lg:col-span-3 bg-white rounded p-4 shadow">
          <ClauseList clauses={clauses} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>

        <main className="lg:col-span-6 bg-white rounded p-4 shadow">
          <ClauseDetail clause={selected} />
        </main>

        <aside className="lg:col-span-3 bg-white rounded p-4 shadow">
          <ChatPanel />
        </aside>
      </div>
    </div>
  );
}
