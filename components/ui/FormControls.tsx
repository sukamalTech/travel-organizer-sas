// components/ui/FormControls.tsx
'use client';

import React from 'react';

interface BaseFieldProps {
    label: string;
    className?: string;
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseFieldProps { }
export function TextInput({ label, className = '', ...props }: TextInputProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {label}
            </label>
            <input
                type="text"
                {...props}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
        </div>
    );
}

interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement>, BaseFieldProps { }
export function DateInput({ label, className = '', ...props }: DateInputProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {label}
            </label>
            <input
                type="date"
                {...props}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
        </div>
    );
}

interface TextAreaInputProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    BaseFieldProps { }
export function TextAreaInput({ label, className = '', ...props }: TextAreaInputProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {label}
            </label>
            <textarea
                {...props}
                className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
            />
        </div>
    );
}

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md';
}
export function ActionButton({
    variant = 'primary',
    size = 'sm',
    className = '',
    children,
    ...props
}: ActionButtonProps) {
    const variants = {
        primary:
            'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs disabled:opacity-50',
        secondary:
            'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 disabled:opacity-50',
        danger:
            'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs disabled:opacity-50',
    };

    const sizes = {
        sm: 'px-2.5 py-1.5 text-xs rounded-xl',
        md: 'px-4 py-2 text-xs rounded-xl',
    };

    return (
        <button
            {...props}
            className={`inline-flex items-center justify-center gap-1.5 font-bold transition cursor-pointer ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {children}
        </button>
    );
}