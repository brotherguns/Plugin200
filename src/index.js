import { fluxDispatcher } from "@vendetta/metro/common";
import { NativeModules } from "react-native";

const { DCDFileManager, BundleUpdaterManager } = NativeModules;

function handleAccountSwap() {
    try {
        if (DCDFileManager && typeof DCDFileManager.clearCache === 'function') {
            DCDFileManager.clearCache();
        }
        if (BundleUpdaterManager && typeof BundleUpdaterManager.reload === 'function') {
            BundleUpdaterManager.reload();
        }
    } catch (error) {}
}

export default {
    onLoad: () => {
        fluxDispatcher.subscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        fluxDispatcher.subscribe("LOGOUT", handleAccountSwap);
    },
    onUnload: () => {
        fluxDispatcher.unsubscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        fluxDispatcher.unsubscribe("LOGOUT", handleAccountSwap);
    }
};
