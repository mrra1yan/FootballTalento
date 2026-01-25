"use client";

import { useEffect } from 'react';
import { useLanguageStore } from '@/lib/i18n';

export function GeoInitializer() {
    const { initializeGeoSettings, _hasHydrated } = useLanguageStore();

    useEffect(() => {
        if (_hasHydrated) {
            initializeGeoSettings();
        }
    }, [_hasHydrated, initializeGeoSettings]);

    return null;
}
