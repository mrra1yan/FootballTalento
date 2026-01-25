// lib/geo.ts

export interface GeoInfo {
    countryCode: string;
    currencyCode: string;
    languageCode: string;
}

const COUNTRY_TO_LANG: Record<string, string> = {
    'MA': 'ar',
    'SA': 'ar',
    'AE': 'ar',
    'EG': 'ar',
    'IQ': 'ar',
    'FR': 'fr',
    'IT': 'it',
    'DE': 'de',
    'ES': 'es',
    'PT': 'pt',
    'BR': 'pt',
    'TR': 'tr',
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
    'MA': 'MAD',
    'AE': 'AED',
    'TR': 'TRY',
    'CH': 'CHF',
    // Euro countries
    'FR': 'EUR',
    'DE': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'PT': 'EUR',
    'AT': 'EUR',
    'BE': 'EUR',
    'FI': 'EUR',
    'GR': 'EUR',
    'IE': 'EUR',
    'LU': 'EUR',
    'NL': 'EUR',
};

async function fetchWithTimeout(url: string, timeout = 3000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

export async function detectGeoLocation(): Promise<GeoInfo | null> {
    const apis = [
        // 1. ipwho.is (Free tier)
        async () => {
            const res = await fetchWithTimeout('https://ipwho.is/');
            const data = await res.json();
            if (data && data.success) {
                return {
                    countryCode: data.country_code,
                    currencyCode: data.currency?.code || 'USD',
                    languageCode: COUNTRY_TO_LANG[data.country_code] || 'en'
                };
            }
            throw new Error('ipwho.is failed');
        },
        // 2. freeipapi.com (Free)
        async () => {
            const res = await fetchWithTimeout('https://freeipapi.com/api/json');
            const data = await res.json();
            if (data && data.countryCode) {
                return {
                    countryCode: data.countryCode,
                    currencyCode: COUNTRY_TO_CURRENCY[data.countryCode] || 'USD',
                    languageCode: COUNTRY_TO_LANG[data.countryCode] || 'en'
                };
            }
            throw new Error('freeipapi failed');
        },
        // 3. ip-api.com (Free for non-commercial)
        async () => {
            const res = await fetchWithTimeout('http://ip-api.com/json/');
            const data = await res.json();
            if (data && data.status === 'success') {
                return {
                    countryCode: data.countryCode,
                    currencyCode: COUNTRY_TO_CURRENCY[data.countryCode] || 'USD',
                    languageCode: COUNTRY_TO_LANG[data.countryCode] || 'en'
                };
            }
            throw new Error('ip-api failed');
        },
        // 4. ipapi.co (Free tier)
        async () => {
            const res = await fetchWithTimeout('https://ipapi.co/json/');
            const data = await res.json();
            if (data && !data.error) {
                return {
                    countryCode: data.country_code,
                    currencyCode: data.currency || 'USD',
                    languageCode: COUNTRY_TO_LANG[data.country_code] || 'en'
                };
            }
            throw new Error('ipapi.co failed');
        }
    ];

    for (const api of apis) {
        try {
            const result = await api();
            if (result) return result;
        } catch {
            // Try next API
            continue;
        }
    }

    return null;
}
