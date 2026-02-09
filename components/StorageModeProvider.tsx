'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type StorageMode = 'supabase' | 'local';

interface StorageModeContextType {
    storageMode: StorageMode;
    setStorageMode: (mode: StorageMode) => void;
    isSupabaseAvailable: boolean;
}

const StorageModeContext = createContext<StorageModeContextType>({
    storageMode: 'local',
    setStorageMode: () => { },
    isSupabaseAvailable: false,
});

export const useStorageMode = () => useContext(StorageModeContext);

export function StorageModeProvider({ children }: { children: React.ReactNode }) {
    const [storageMode, setStorageModeState] = useState<StorageMode>('local');
    const [isSupabaseAvailable, setIsSupabaseAvailable] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Check if Supabase is configured
    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const isConfigured = Boolean(
            supabaseUrl &&
            supabaseKey &&
            !supabaseUrl.includes('placeholder')
        );
        setIsSupabaseAvailable(isConfigured);

        // Load saved storage mode preference
        const savedMode = localStorage.getItem('expense-tracker-storage-mode') as StorageMode;
        if (savedMode && (savedMode === 'local' || (savedMode === 'supabase' && isConfigured))) {
            setStorageModeState(savedMode);
        } else if (isConfigured) {
            // Default to Supabase if available
            setStorageModeState('supabase');
        }

        setMounted(true);
    }, []);

    const setStorageMode = (mode: StorageMode) => {
        // Only allow Supabase mode if it's configured
        if (mode === 'supabase' && !isSupabaseAvailable) {
            console.warn('Supabase is not configured. Staying in local mode.');
            return;
        }

        setStorageModeState(mode);
        localStorage.setItem('expense-tracker-storage-mode', mode);
    };

    if (!mounted) {
        return null;
    }

    return (
        <StorageModeContext.Provider value={{ storageMode, setStorageMode, isSupabaseAvailable }}>
            {children}
        </StorageModeContext.Provider>
    );
}
