// The current version of our app.
// In a real automated pipeline, this might be bumped automatically.
export const APP_VERSION = "1.2.0";

/**
 * Version Check (Simulation)
 * 
 * What it does:
 * Checks if the running app version matches the latest deployment.
 * 
 * Why:
 * If a user keeps the tab open for days, they might be running old code that doesn't 
 * match the API anymore. This checks if they need to refresh.
 */
export const checkVersion = async () => {
    // Diff simulation: Assume 'latest' is always 1.2.0 for now.
    // If we wanted to simulate a "Bad Deployment" (Old Cache),
    // we would pretend this client is running "1.1.0".

    const clientVersion = APP_VERSION;
    // const remoteVersion = await fetch('/meta.json').then(r => r.json()).version;

    console.log(`[SYSTEM] Client Version: ${clientVersion}`);
    return true; // Pretend everything is fine.
};

// Global Error Handler for "Chunk Load Errors"
// 
// What is a "Chunk Load Error"?
// It happens when the browser tries to download a piece of code (like "SettingsPage")
// but the server says "That file doesn't exist anymore" (because we deployed a new version).
// 
// Solution:
// If we see this error, we force the browser to reload the page. 
// This makes it download the NEW fresh index file, which points to the NEW valid chunks.
window.addEventListener('error', (e) => {
    // Check if the error message mentions "Loading chunk" or "missing"
    if (e.message && (e.message.includes('Loading chunk') || e.message.includes('missing'))) {
        console.error("[SYSTEM] New version detected (Chunk Load Error). Reloading...");

        // "true" forces a reload from the server, ignoring the browser cache.
        window.location.reload(true);
    }
});
