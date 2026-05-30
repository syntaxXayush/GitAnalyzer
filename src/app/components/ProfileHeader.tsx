'use client';

import React, { useState } from 'react';
import { AnalyzedProfile } from '@/app/stores/analysisStore';
import Badge from '@/components/ui/Badge';
import AppImage from '@/components/ui/AppImage';
import {
    MapPin,
    Building2,
    Link2,
    RefreshCw,
    ExternalLink,
    Clock,
    Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/app/lib/api';
import { useAnalysisStore } from '@/app/stores/analysisStore';

interface ProfileHeaderProps {
    profile: AnalyzedProfile;
}

function getLevelVariant(level: string): 'novice' | 'developer' | 'senior' | 'expert' | 'legend' {
    const map: Record<string, 'novice' | 'developer' | 'senior' | 'expert' | 'legend'> = {
        Starter: 'novice',
        Emerging: 'developer',
        Builder: 'developer',
        Senior: 'senior',
        Developer: 'developer',
        Expert: 'expert',
        Legend: 'legend',
    };
    return map[level] ?? 'developer';
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
    const [refreshing, setRefreshing] = useState(false);
    const setProfile = useAnalysisStore((state) => state.setProfile);

    const handleRefresh = async () => {
        setRefreshing(true);

        try {
            const response = await apiFetch<{ success: boolean; data: AnalyzedProfile }>(`/api/v1/profiles/${profile.username}/refresh`, {
                method: 'PATCH',
            });
            setProfile(response.data);
            toast.success('Analysis refreshed', {
                description: 'Data pulled from GitHub API just now.',
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to refresh analysis';
            toast.error('Refresh failed', { description: message });
        } finally {
            setRefreshing(false);
        }
    };

    const analyzedDate = new Date(profile.analyzedAt);
    const formattedDate = `${analyzedDate.getFullYear()}-${String(analyzedDate.getMonth() + 1).padStart(2, '0')}-${String(analyzedDate.getDate()).padStart(2, '0')} ${String(analyzedDate.getHours()).padStart(2, '0')}:${String(analyzedDate.getMinutes()).padStart(2, '0')}`;

    return (
        <div className="card-elevated p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <AppImage
                        src={profile.avatarUrl}
                        alt={`${profile.username} GitHub profile avatar`}
                        width={72}
                        height={72}
                        className="rounded-full ring-2 ring-border"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-positive border-2 border-card" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-lg font-semibold text-foreground">{profile.name}</h2>
                        <Badge variant={getLevelVariant(profile.level)}>{profile.level}</Badge>
                    </div>
                    <p className="text-sm font-mono text-muted-foreground mb-2">@{profile.username}</p>
                    {profile.bio && (
                        <p className="text-sm text-secondary-foreground mb-3 max-w-xl">{profile.bio}</p>
                    )}
                    <div className="flex items-center gap-4 flex-wrap">
                        {profile.location && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin size={12} />
                                {profile.location}
                            </span>
                        )}
                        {profile.company && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Building2 size={12} />
                                {profile.company}
                            </span>
                        )}
                        {profile.blog && (
                            <a
                                href={profile.blog}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                            >
                                <Link2 size={12} />
                                {profile.blog.replace('https://', '')}
                            </a>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock size={12} />
                            Analyzed {formattedDate}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <a
                        href={`https://github.com/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted border border-border text-xs font-medium text-foreground hover:bg-secondary transition-all duration-150"
                    >
                        <ExternalLink size={13} />
                        View on GitHub
                    </a>
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 border border-primary/25 text-xs font-medium text-primary hover:bg-primary/15 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {refreshing ? (
                            <Loader2 size={13} className="animate-spin" />
                        ) : (
                            <RefreshCw size={13} />
                        )}
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
}