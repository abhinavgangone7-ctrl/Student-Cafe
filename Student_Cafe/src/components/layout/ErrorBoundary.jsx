import React from 'react';
// Import our custom logger to record errors when they happen.
import { logger } from '../../lib/logger';
// Import an icon to show a warning triangle to the user.
import { AlertTriangle } from 'lucide-react';

/**                                     
 * ErrorBoundary Component
 * 
 * What it does: 
 * This is a "safety net" for the application. If any part of the app crashes 
 * (throws an error), this component catches it instead of letting the whole screen go blank.
 * 
 * Why it is needed:
 * Without this, a single error in a small button could crash the entire app, 
 * showing a blank white screen to the user. This ensures we show a nice "Something went wrong" message instead.
 */
class ErrorBoundary extends React.Component {
    // The constructor is the first thing that runs when this component is created.
    // usage: It sets up the initial "state" (memory) of the component.
    constructor(props) {
        super(props); // "super" passes options to the parent React component class. Required boilerplate.

        // "state" is the component's internal memory.
        // We start with "hasError: false" because everything is working fine initially.
        this.state = { hasError: false };
    }

    /**
     * static getDerivedStateFromError
     * 
     * What it does:
     * This is a special React lifecycle method (think of it as an automatic hook).
     * React calls this FUNCTION automatically as soon as an error is detected in any child component.
     * 
     * Role:
     * It updates the state to "hasError: true", which triggers the component to re-render 
     * and show the error message.
     */
    static getDerivedStateFromError(error) {
        // Return the new state so the app knows something broke.
        return { hasError: true };
    }

    /**                                 
     * componentDidCatch
     * 
     * What it does:
     * This runs AFTER the error has been caught and the state has been updated.
     * 
     * Role:
     * It is used for logging/reporting. We use it to send the error details to our logging system 
     * so developers can see what went wrong.
     */
    componentDidCatch(error, errorInfo) {
        // Log the crash in Plain English using our custom logger.
        // "logger.error" saves the details securely.
        logger.error(
            "SYSTEM", // Category: This is a system-level error.
            " The application crashed unexpectedly while rendering.", // Message: What happened.
            { error, componentStack: errorInfo.componentStack } // Data: The actual error object and where it happened in the code.
        );
    }

    // "render" determines what shows up on the screen.
    render() {
        // SCENARIO 1: An error happened.
        // If "hasError" is true (set by getDerivedStateFromError), we show the fallback UI.
        if (this.state.hasError) {
            return (
                // A centered container with a light/dark mode background color.
                <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
                    {/* The specialized card box that holds the error message */}
                    <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-xl">
                        {/* Red circle icon background */}
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            {/* The warning triangle icon */}
                            <AlertTriangle size={32} />
                        </div>
                        {/* Main error title */}
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            Something went wrong
                        </h1>
                        {/* Helpful message for the user */}
                        <p className="text-zinc-500 mb-6">
                            We've logged the error and our team has been notified. Please try refreshing the page.
                        </p>
                        {/* 
                           Reload Button
                           Action: When clicked, it forces the browser to reload the entire page (window.location.reload).
                           Why: Often, errors are temporary glitches. Reloading gives the app a chance to reset and start fresh.
                        */}
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black font-medium rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        // SCENARIO 2: No error.
        // If everything is fine, we render "this.props.children".
        // "this.props.children" represents whatever components are nested INSIDE this ErrorBoundary.
        // Example: <ErrorBoundary><App /></ErrorBoundary> -> "App" is the child.
        return this.props.children;
    }
}

// Export the component so it can be imported and used in other files (usually in the main entry file like App.jsx/main.jsx).
export default ErrorBoundary;
