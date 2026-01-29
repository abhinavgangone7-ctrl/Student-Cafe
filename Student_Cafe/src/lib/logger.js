/**
 * Structured Logging Utility
 * Ensures all errors are logged in a readable, "Plain English" format
 * to help developers debug issues quickly.
 */

const LOG_LEVELS = {
    INFO: "INFO",
    WARN: "WARN",
    ERROR: "ERROR",
};

const formatMessage = (level, context, message, details = null) => {
    const timestamp = new Date().toISOString();
    return {
        timestamp,
        level,
        context: context.toUpperCase(),
        message, // The "Plain English" explanation
        technicalDetails: details // The raw error object
    };
};

export const logger = {
    info: (context, message, details) => {
        const log = formatMessage(LOG_LEVELS.INFO, context, message, details);
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
        if (error) {
            console.error("   ↳ Technical Details:", error);
        }
    }
};
