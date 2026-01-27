import React from 'react';
import { logger } from '../../lib/logger';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the crash in Plain English
        logger.error(
            "SYSTEM",
            " The application crashed unexpectedly while rendering.",
            { error, componentStack: errorInfo.componentStack }
        );
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
                    <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-xl">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            Something went wrong
                        </h1>
                        <p className="text-zinc-500 mb-6">
                            We've logged the error and our team has been notified. Please try refreshing the page.
                        </p>
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

        return this.props.children;
    }
}

export default ErrorBoundary;
