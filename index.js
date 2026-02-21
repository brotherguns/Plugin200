"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

// Pull native modules directly from the global Kettu/Vendetta object
const { fluxDispatcher } = window.vendetta.metro.common;
const { NativeModules } = window.vendetta.metro.common.ReactNative;

function handleAccountSwap() {
    try {
        // Option 1: Instruct Discord's native file manager to dump the cache
        if (NativeModules.DCDFileManager && typeof NativeModules.DCDFileManager.clearCache === 'function') {
            NativeModules.DCDFileManager.clearCache();
        }
        
        // Option 2: Force the bundle updater to reload the hermes bytecode
        if (NativeModules.BundleUpdaterManager && typeof NativeModules.BundleUpdaterManager.reload === 'function') {
            NativeModules.BundleUpdaterManager.reload();
        }
    } catch (error) {}
}

// Export the lifecycle hooks exactly as the loader expects
exports.default = {
    onLoad: function() {
        fluxDispatcher.subscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        fluxDispatcher.subscribe("LOGOUT", handleAccountSwap);
    },
    onUnload: function() {
        fluxDispatcher.unsubscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        fluxDispatcher.unsubscribe("LOGOUT", handleAccountSwap);
    }
};
