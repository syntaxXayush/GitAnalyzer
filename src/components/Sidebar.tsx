'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
    BookOpen,
    Search,
    Users,
    ChevronLeft,
    ChevronRight,
    GitBranch,
    Zap,
    ExternalLink,
} from 'lucide-react';

interface NavItem {
    id: string;
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    description: string;
}

const navItems: NavItem[] = [
    {
        id: 'nav-analyzer',
        label: 'Profile Analyzer',
        href: '/',
        icon: <Search size={18} />,
        description: 'Analyze a GitHub profile',
    },
    {
        id: 'nav-profiles',
        label: 'Analyzed Profiles',
        href: '/analyzed-profiles',
        icon: <Users size={18} />,
        badge: 48,
        description: 'Browse stored analyses',
    },
    {
        id: 'nav-docs',
        label: 'API Documentation',
        href: '/api-documentation',
        icon: <BookOpen size={18} />,
        description: 'REST API reference',
    },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={`relative flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex-shrink-0 ${collapsed ? 'w-16' : 'w-60'
                }`}
        >
            {/* Logo */}
            <div
                className={`flex items-center border-b border-border h-16 px-3 ${collapsed ? 'justify-center' : 'gap-3'
                    }`}
            >
                <AppLogo size={32} />
                {!collapsed && (
                    <span className="font-semibold text-base text-foreground tracking-tight truncate">
                        GitAnalyzer
                    </span>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
                {!collapsed && (
                    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground px-3 pb-2">
                        Navigation
                    </p>
                )}
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 relative ${isActive
                                    ? 'bg-primary/10 text-primary' : 'text-secondary-foreground hover:bg-muted hover:text-foreground'
                                }`}
                        >
                            <span className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`}>
                                {item.icon}
                            </span>
                            {!collapsed && (
                                <>
                                    <span className="text-sm font-medium truncate flex-1">
                                        {item.label}
                                    </span>
                                    {item.badge !== undefined && (
                                        <span className="text-2xs font-semibold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent tabular-nums">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                            {collapsed && item.badge !== undefined && (
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
                            )}
                            {/* Tooltip for collapsed */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2.5 py-1.5 bg-secondary border border-border rounded-md text-xs text-foreground whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 shadow-lg">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* API Status */}
            {!collapsed && (
                <div className="px-3 py-3 mx-2 mb-3 rounded-lg bg-muted border border-border">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-positive animate-pulse" />
                        <span className="text-xs font-medium text-positive">API Online</span>
                    </div>
                    <p className="text-2xs text-muted-foreground font-mono">
                        v1.4.2 · 99.9% uptime
                    </p>
                </div>
            )}

            {/* GitHub Link */}
            {!collapsed && (
                <div className="px-2 pb-3">
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 text-sm"
                    >
                        <GitBranch size={15} />
                        <span className="text-xs font-medium">GitHub API</span>
                        <ExternalLink size={11} className="ml-auto opacity-50" />
                    </a>
                </div>
            )}

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150 z-10"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </button>

            {/* Version */}
            {!collapsed && (
                <div className="px-4 pb-4 flex items-center gap-1.5">
                    <Zap size={11} className="text-warning" />
                    <span className="text-2xs text-muted-foreground font-mono">
                        GitAnalyzer v1.4.2
                    </span>
                </div>
            )}
        </aside>
    );
}