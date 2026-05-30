const DEFAULT_API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000').replace(/\/$/, '');

export function getApiBaseUrl() {
    return DEFAULT_API_BASE_URL;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init.headers ?? {}),
        },
    });

    const payload = await safeJson(response);

    if (!response.ok) {
        const message =
            typeof payload === 'object' && payload && 'error' in payload && payload.error && typeof payload.error === 'object' && 'message' in payload.error
                ? String((payload.error as { message?: unknown }).message ?? 'Request failed')
                : 'Request failed';

        throw new Error(message);
    }

    return payload as T;
}

async function safeJson(response: Response): Promise<unknown> {
    try {
        return await response.json();
    } catch {
        return null;
    }
}