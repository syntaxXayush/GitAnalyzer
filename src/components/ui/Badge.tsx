import React from 'react';

type BadgeVariant =
    | 'default' | 'positive' | 'negative' | 'warning' | 'info' | 'novice' | 'developer' | 'senior' | 'expert' | 'legend' | 'get' | 'post' | 'delete' | 'put';

interface BadgeProps {
    variant?: BadgeVariant;
    children: React.ReactNode;
    className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
    default: 'bg-secondary text-secondary-foreground border border-border',
    positive: 'bg-[var(--positive-bg)] text-positive border border-positive/25',
    negative: 'bg-[var(--negative-bg)] text-negative border border-negative/25',
    warning: 'bg-[var(--warning-bg)] text-warning border border-warning/25',
    info: 'bg-[var(--info-bg)] text-accent border border-accent/25',
    novice: 'level-novice',
    developer: 'level-developer',
    senior: 'level-senior',
    expert: 'level-expert',
    legend: 'level-legend',
    get: 'method-get',
    post: 'method-post',
    delete: 'method-delete',
    put: 'method-put',
};

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold font-mono tracking-wide ${variantClasses[variant]} ${className}`}
        >
            {children}
        </span>
    );
}