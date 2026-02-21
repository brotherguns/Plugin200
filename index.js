// Auto Cache Clear Plugin
// Hooks into Discord's Flux Dispatcher to clear the cache upon account swap or logout.

import { fluxDispatcher } from "@vendetta/metro/common";
import { NativeModules } from "react-native";

// Pull Discord's native iOS modules from the React Native bridge
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

export default {
    onLoad: () => {
        console.log("[AutoCacheClear] Plugin loaded. Listening for MULTI_ACCOUNT_VALIDATE_TOKEN.");
        
        // Fired the moment you select a new account in the switcher
        fluxDispatcher.subscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        
        // Fired on a standard logout, just to be safe
        fluxDispatcher.subscribe("LOGOUT", handleAccountSwap);
    },
    
    onUnload: () => {
        console.log("[AutoCacheClear] Plugin unloaded.");
        
        // Clean up listeners to prevent memory leaks
        fluxDispatcher.unsubscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        fluxDispatcher.unsubscribe("LOGOUT", handleAccountSwap);
    }
};
