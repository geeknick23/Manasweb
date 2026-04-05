export const safeLocalStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === 'undefined') {
            // console.log('[safeLocalStorage] SSR detected, returning null provided proper guards are in place'); 
            return null;
        }
        try {
            // console.log('[safeLocalStorage] Client side check');
            // Check if localStorage exists and has getItem method
            if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
                return localStorage.getItem(key);
            } else {
                console.warn('[safeLocalStorage] localStorage found but is broken:', typeof localStorage);
            }
        } catch (e) {
            console.warn('localStorage access failed:', e);
        }
        return null;
    },

    setItem: (key: string, value: string): void => {
        if (typeof window === 'undefined') return;
        try {
            if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
                localStorage.setItem(key, value);
            }
        } catch (e) {
            console.warn('localStorage access failed:', e);
        }
    },

    removeItem: (key: string): void => {
        if (typeof window === 'undefined') return;
        try {
            if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
                localStorage.removeItem(key);
            }
        } catch (e) {
            console.warn('localStorage access failed:', e);
        }
    }
};
