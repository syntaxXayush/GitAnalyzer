import React from 'react';
import { Search, Users, BookOpen } from 'lucide-react';

type EmptyStateType = 'profiles' | 'repos' | 'search' | 'docs';

interface EmptyStateProps {
    type: EmptyStateType;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const config: Record<EmptyStateType, { icon: React.ReactNode; heading: string; body: string }> = {
    profiles: {
        icon: <Users size={36} className="text-muted-foreground" />,
        heading: 'No analyzed profiles yet',
        body: 'Analyze a GitHub username to store profile insights here. Results are cached and refreshable.',
    },
    repos: {
        icon: <BookOpen size={36} className="text-muted-foreground" />,
        heading: 'No repositories found',
        body: "This GitHub account has no public repositories, or they couldn't be fetched.",
    },
    search: {
        icon: <Search size={36} className="text-muted-foreground" />,
        heading: 'No profiles match your filters',
        body: 'Try adjusting your search query or filter criteria to find analyzed profiles.',
    },
    docs: {
        icon: <BookOpen size={36} className="text-muted-foreground" />,
        heading: 'No endpoints found',
        body: 'The API documentation could not be loaded. Check the API status indicator.',
    },
};

export default function EmptyState({ type, message, action }: EmptyStateProps) {
    const { icon, heading, body } = config[type];
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="p-4 rounded-2xl bg-muted mb-4">{icon}</div>
            <h3 className="text-base font-semibold text-foreground mb-2">{heading}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-5">{message ?? body}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}