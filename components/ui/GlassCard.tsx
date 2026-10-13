import { ReactNode } from 'react';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    glow?: boolean;
}

export default function GlassCard({ children, className = '', glow = false }: GlassCardProps) {
    return (
        <div className={`glass-card rounded-2xl p-6 transition-all duration-300 ${glow ? 'glass-glow border-indigo-500/30' : ''} ${className}`}>
            {children}
        </div>
    );
}