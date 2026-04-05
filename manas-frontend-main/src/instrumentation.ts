export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Check if localStorage is missing or broken (e.g. getItem is not a function)
        const isLocalStorageBroken =
            typeof global.localStorage === 'undefined' ||
            (global.localStorage && typeof global.localStorage.getItem !== 'function');

        if (isLocalStorageBroken) {
            console.log('[Instrumentation] Polyfilling broken/missing localStorage for SSR');

            const mockStorage = {
                getItem: (key: string) => {
                    void key;
                    return null;
                },
                setItem: (key: string, value: string) => {
                    void key;
                    void value;
                },
                removeItem: (key: string) => {
                    void key;
                },
                clear: () => { },
                length: 0,
                key: (index: number) => {
                    void index;
                    return null;
                },
            };

            // Define it on global
            Object.defineProperty(global, 'localStorage', {
                value: mockStorage,
                writable: true,
                configurable: true
            });
        }
    }
}
