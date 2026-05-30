import React from 'react';
import AnalyzedProfileDetails from '../components/AnalyzedProfileDetails';

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function AnalyzedProfilePage({ params }: PageProps) {
    const { username } = await params;

    return <AnalyzedProfileDetails username={username} />;
}