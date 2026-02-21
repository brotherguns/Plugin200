// Auto Cache Clear Plugin
// Hooks into Discord's Flux Dispatcher to clear the cache upon account swap or logout.

// Pull Discord's native modules directly from Vendetta's global object
const { fluxDispatcher } = window.vendetta.metro.common;
const { NativeModules } = window.vendetta.metro.common.ReactNative;

const { DCDFileManager, BundleUpdaterManager } = NativeModules;

function handleAccountSwap() {
    console.log("[AutoCacheClear] Account swap event detected. Attempting to clear cache...");
    
    try {
        // Option 1: Instruct Discord's native file manager to dump the cache
        if (DCDFileManager && typeof DCDFileManager.clearCache === 'function') {
            DCDFileManager.clearCache();
            console.log("[AutoCacheClear] DCDFileManager cache successfully cleared.");
        }
        
        // Option 2: Force the bundle updater to reload, which often invalidates stale hermes bytecode
        if (BundleUpdaterManager && typeof BundleUpdaterManager.reload === 'function') {
            BundleUpdaterManager.reload();
            console.log("[AutoCacheClear] BundleUpdaterManager reload triggered.");
        }
    } catch (error) {
        console.error("[AutoCacheClear] Failed to wipe cache natively:", error);
    }
}

// Vendetta expects a default export with onLoad and onUnload
module.exports = {
    default: {
        onLoad: () => {
            console.log("[AutoCacheClear] Plugin loaded. Listening for account swaps.");
            fluxDispatcher.subscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
            fluxDispatcher.subscribe("LOGOUT", handleAccountSwap);
        },
        
        onUnload: () => {
            console.log("[AutoCacheClear] Plugin unloaded.");
            fluxDispatcher.unsubscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
            fluxDispatcher.unsubscribe("LOGOUT", handleAccountSwap);
        }
    }
};
