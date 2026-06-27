declare global {
	interface Window {
		APP_CONFIG?: {
			API_URL?: string;
		};
	}
}

export function getApiUrl(): string {
    return window.APP_CONFIG?.API_URL || import.meta.env.VITE_API_URL;
}