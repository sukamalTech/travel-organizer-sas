import { ReactNode } from 'react';
import Link from 'next/link';

interface CTAButtonProps {
    children: ReactNode;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
    onClick?: () => void;
    className?: string;
}

export default function CTAButton({
    children,
    href,
    variant = 'primary',
    onClick,
    className = '',
}: CTAButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl px-6 py-3.5 transition-all duration-200 active:scale-95 shadow-lg";

    const variants = {
        primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white shadow-indigo-500/25",
        secondary: "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700/60 shadow-slate-900/50",
        outline: "border border-indigo-500/30 hover:border-indigo-500/80 bg-indigo-500/10 text-indigo-300 hover:text-white"
    };

    const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

    if (href) {
        return (
            <Link href={href} className={combinedClasses}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={combinedClasses}>
            {children}
        </button>
    );
}