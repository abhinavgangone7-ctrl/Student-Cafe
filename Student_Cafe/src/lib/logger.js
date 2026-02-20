/**
 * Structured Logging Utility
 * 
 * What it does:
 * Ensures all errors are logged in a consistent, readable, "Plain English" format.
 * 
 * Why:
 * When things break, we don't just want a cryptic error code. We want to know:
 * 1. WHERE it happened (Context)
 * 2. WHAT happened (Plain English Message)
 * 3. TECHNICAL DETAILS (The ugly error object)
 */

// Define the types of logs we care about.
const LOG_LEVELS = {
    INFO: "INFO",   // Just saying something happened (e.g., "User logged in")
    WARN: "WARN",   // Something completely wrong, but app can continue (e.g., "Image failed to load")
    ERROR: "ERROR", // Something broke (e.g., "Payment failed")
};

// A helper to format the log object consistently.
const formatMessage = (level, context, message, details = null) => {
    const timestamp = new Date().toISOString(); // "2023-10-27T10:00:00Z"
    return {
        timestamp,
        level,
        context: context.toUpperCase(), // e.g., "AUTH", "CART", "SYSTEM"
        message, // The "Plain English" explanation
        technicalDetails: details // The raw error object
    };
};

/**
 * The Logger Object
 * 
 * usage:
 * logger.info("AUTH", "User signed out");
 * logger.error("PAYMENT", "Card declined", errorObj);
 */
export const logger = {
    info: (context, message, details) => {
        const log = formatMessage(LOG_LEVELS.INFO, context, message, details);
        // "console.log" prints to the browser's developer tools console.
        console.log(`ℹ️ [${log.context}] ${log.message}`, details || "");
    },

    warn: (context, message, details) => {
        const log = formatMessage(LOG_LEVELS.WARN, context, message, details);
        console.warn(`⚠️ [${log.context}] ${log.message}`, details || "");
    },

    error: (context, message, error) => {
        const log = formatMessage(LOG_LEVELS.ERROR, context, message, error);
        // We log the descriptive message first, then the raw error stack
        console.error(`🚨 [${log.context}] ${log.message}`);

        // If there's a technical error object (like a stack trace), show it too.
        if (error) {
            console.error("   ↳ Technical Details:", error);
        }
    }
};
