'use strict';

var common = require('@vendetta/metro/common');
var reactNative = require('react-native');

const { DCDFileManager, BundleUpdaterManager } = reactNative.NativeModules;
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
var index = {
    onLoad: ()=>{
        common.fluxDispatcher.subscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        common.fluxDispatcher.subscribe("LOGOUT", handleAccountSwap);
    },
    onUnload: ()=>{
        common.fluxDispatcher.unsubscribe("MULTI_ACCOUNT_VALIDATE_TOKEN", handleAccountSwap);
        common.fluxDispatcher.unsubscribe("LOGOUT", handleAccountSwap);
    }
};

module.exports = index;
