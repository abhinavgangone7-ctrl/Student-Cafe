import { useCallback } from 'react';

/**
 * Custom Hook for Client-Side Rate Limiting
 * Prevents users/bots from spamming actions in the UI.
 * 
 * @param {string} actionName - Unique identifier for the action (e.g. "submit_order")
 * @param {number} cooldownMs - Cooldown time in milliseconds (default 5000ms)
 * @returns {Function} checkLimit - Function to call before performing the action. Throws error if limited.
 */
export const useRateLimit = (actionName, cooldownMs = 5000) => {

    const checkLimit = useCallback(() => {
        const storageKey = `ratelimit_${actionName}`;
        const lastAttempt = localStorage.getItem(storageKey);
        const now = Date.now();

        if (lastAttempt) {
            const timeSinceLast = now - parseInt(lastAttempt, 10);
            if (timeSinceLast < cooldownMs) {
                const waitSeconds = Math.ceil((cooldownMs - timeSinceLast) / 1000);
                throw new Error(`Please wait ${waitSeconds}s before trying again.`);
            }
        }

        // Update timestamp
        localStorage.setItem(storageKey, now.toString());
        return true;
    }, [actionName, cooldownMs]);

    return checkLimit;
};
