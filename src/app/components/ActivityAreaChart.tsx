'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const AreaChartInner = dynamic(() => import('./ActivityAreaChartInner'), {
    ssr: false,
    loading: () => <ChartSkeleton height={200} />,
});

interface Props {
    data: { id: string; month: string; commits: number; prs: number }[];
}

export default function ActivityAreaChart({ data }: Props) {
    return (
        <div className="card-elevated p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">Commit Activity</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Monthly commits and pull requests (last 12 months)</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-primary inline-block" />
                        <span className="text-2xs text-muted-foreground">Commits</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1.5 rounded-full bg-accent inline-block" />
                        <span className="text-2xs text-muted-foreground">Pull Requests</span>
                    </div>
                </div>
            </div>
            <AreaChartInner data={data} />
        </div>
    );
}