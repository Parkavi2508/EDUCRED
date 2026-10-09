import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../lib/storage';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  FileText,
  Clock,
  Layers,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

export const CreditsLedgerView: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const ledgerEntries = db.getCreditLedger(currentUser?.id);
  const totalCredits = ledgerEntries.reduce((sum, e) => sum + e.amount, 0);

  // Group credits by category
  const categoryTotals: Record<string, number> = {};
  for (const entry of ledgerEntries) {
    categoryTotals[entry.category] = (categoryTotals[entry.category] || 0) + entry.amount;
  }

  const filteredEntries = selectedCategory === 'all'
    ? ledgerEntries
    : ledgerEntries.filter(e => e.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & KPI */}
      <div className="bg-gradient-to-r from-[#192A56] to-[#253d75] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-[#F7D794] uppercase tracking-wider block mb-1">
            Institutional Recognition Account
          </span>
          <h2 className="text-2xl font-bold tracking-tight">
            Recognition Credit Ledger
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Credits are awarded into an immutable, append-only ledger upon verified human approval.
            Each entry is tied to an official contribution and idempotency key.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center min-w-[160px]">
          <span className="text-xs text-slate-300 font-medium block">Total Earned Credits</span>
          <span className="text-4xl font-extrabold text-[#F7D794] tabular-nums block mt-1">
            {totalCredits}
          </span>
          <span className="text-[10px] text-emerald-300 mt-1 flex items-center justify-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified & Audited
          </span>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {Object.entries(categoryTotals).map(([cat, pts]) => (
          <div
            key={cat}
            onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedCategory === cat
                ? 'bg-[#192A56] text-white border-[#192A56] shadow-sm'
                : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className={`text-[10px] truncate mb-1 ${selectedCategory === cat ? 'text-slate-300' : 'text-slate-500'}`}>
              {cat}
            </div>
            <div className={`text-xl font-bold tabular-nums ${selectedCategory === cat ? 'text-[#F7D794]' : 'text-[#192A56]'}`}>
              {pts} <span className="text-xs font-normal">pts</span>
            </div>
          </div>
        ))}
      </div>

      {/* Append-Only Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#192A56]">Append-Only Credit Transactions</h3>
            <p className="text-[11px] text-slate-500">
              Immutable ledger history. Compensating entries used for any corrections.
            </p>
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear filter ({selectedCategory})
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Contribution Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Credits</th>
                <th className="py-3 px-4">Explanation & Notes</th>
                <th className="py-3 px-4">Idempotency Key</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No transactions found matching category.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-[200px] truncate">
                      {item.contributionTitle}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {item.category}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.transactionType === 'award'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.transactionType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-600 tabular-nums whitespace-nowrap text-sm">
                      +{item.amount}
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-[240px] truncate" title={item.explanation}>
                      {item.explanation}
                    </td>
                    <td className="py-3 px-4 font-mono text-[9px] text-slate-400 whitespace-nowrap">
                      {item.idempotencyKey.slice(0, 22)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
