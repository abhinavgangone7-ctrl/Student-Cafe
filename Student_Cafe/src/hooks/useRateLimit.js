import { useCallback } from 'react';

/**
 * Custom Hook for Client-Side Rate Limiting
 * 
 * What it does:
 * Prevents users/bots from spamming actions in the UI (like clicking "Submit" 100 times).
 * 
 * How it works:
 * It stores the last time the action was performed in localStorage. 
 * If you try again too soon, it throws an error.
 * 
 * @param {string} actionName - Unique identifier (e.g. "submit_order") to track different actions separately.
 * @param {number} cooldownMs - How long to wait in milliseconds (default 5000ms = 5s).
 * @returns {Function} checkLimit - Function to call before performing the action.
 */
export const useRateLimit = (actionName, cooldownMs = 5000) => {

    /**
     * checkLimit Function
     * 
     * Call this BEFORE doing the sensitive action.
     * Example:
     *   try {
     *      checkLimit();
     *      // do action
     *   } catch (error) {
     *      alert(error.message); // "Please wait 5s..."
     *   }
     */
    const checkLimit = useCallback(() => {
        const storageKey = `ratelimit_${actionName}`; // e.g., "ratelimit_feedback_form"
        const lastAttempt = localStorage.getItem(storageKey);
        const now = Date.now(); // Current time in milliseconds.

        if (lastAttempt) {
            // Calculate time passed since last attempt.
            const timeSinceLast = now - parseInt(lastAttempt, 10);

            // If not enough time has passed...
            if (timeSinceLast < cooldownMs) {
                const waitSeconds = Math.ceil((cooldownMs - timeSinceLast) / 1000);
                // STOP the action by throwing an error.
                throw new Error(`Please wait ${waitSeconds}s before trying again.`);
            }
        }

        // If we are allowed to proceed, update the timestamp to NOW.
        localStorage.setItem(storageKey, now.toString());
        return true;
    }, [actionName, cooldownMs]);

    return checkLimit;
};
