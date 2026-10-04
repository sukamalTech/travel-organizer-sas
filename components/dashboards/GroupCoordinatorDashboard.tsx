// src/components/dashboards/GroupCoordinatorDashboard.tsx
'use client';

import React from 'react';
import { Users, DollarSign, UserCheck, Plus } from 'lucide-react';

export default function GroupCoordinatorDashboard({ expenseData, memberCount }: { expenseData: any[], memberCount: number }) {
    return (
        <div className="space-y-4 max-w-4xl mx-auto p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Group Ledger Workspace</h2>
                    <p className="text-xs text-slate-500">{memberCount || 6} Active Trip Members</p>
                </div>
                <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 transition">
                    <Plus className="w-4 h-4" /> Add Expense
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 block">Total Pool Expense</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">$2,450.00</span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 block">Your Individual Balance</span>
                    <span className="text-2xl font-black text-emerald-500">+$142.50</span>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Settlement Summary</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs">
                        <span className="text-slate-700 dark:text-slate-200">Alex owes Sarah</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">$34.00 (Dinner)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs">
                        <span className="text-slate-700 dark:text-slate-200">David owes You</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">$85.50 (Fuel Stop)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}