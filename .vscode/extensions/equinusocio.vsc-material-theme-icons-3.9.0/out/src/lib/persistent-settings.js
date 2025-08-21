"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable class-methods-use-this */
const node_path_1 = require("node:path");
const path = require("node:path");
const fs_extra_1 = require("fs-extra");
const os = require("os");
const semver_1 = require("semver");
const constants_1 = require("./constants");
const fs_1 = require("./fs");
class PersistentSettings {
    constructor(vscode, globalStoragePath) {
        Object.defineProperty(this, "vscode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: vscode
        });
        Object.defineProperty(this, "globalStoragePath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: globalStoragePath
        });
        Object.defineProperty(this, "settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "defaultState", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.settings = this.getSettings();
        this.defaultState = {
            version: '0.0.0',
        };
    }
    getSettings() {
        var _a;
        const appName = (_a = this.vscode.env.appName) !== null && _a !== void 0 ? _a : '';
        const isDev = /dev/i.test(appName);
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const isOSS = isDev && /oss/i.test(appName);
        const isInsiders = /insiders/i.test(appName);
        const vscodeVersion = new semver_1.SemVer(this.vscode.version).version;
        const isWin = process.platform.startsWith('win');
        const { version } = (0, fs_1.getPackageJson)();
        const extensionSettings = {
            version,
        };
        const persistentSettingsFilePath = path.join(this.globalStoragePath, 'settings.json');
        this.settings = {
            isDev,
            isOSS,
            isInsiders,
            isWin,
            vscodeVersion,
            persistentSettingsFilePath,
            extensionSettings,
        };
        if (!(0, fs_extra_1.existsSync)(this.globalStoragePath)) {
            (0, fs_extra_1.mkdirSync)(this.globalStoragePath);
        }
        this.migrateOldPersistentSettings(isInsiders, isOSS, isDev);
        return this.settings;
    }
    getOldPersistentSettingsPath(isInsiders, isOSS, isDev) {
        const vscodePath = this.vscodePath();
        const vscodeAppName = this.vscodeAppName(isInsiders, isOSS, isDev);
        const vscodeAppUserPath = (0, node_path_1.join)(vscodePath, vscodeAppName, 'User');
        return (0, node_path_1.join)(vscodeAppUserPath, constants_1.FILES.persistentSettings);
    }
    migrateOldPersistentSettings(isInsiders, isOSS, isDev) {
        const oldPersistentSettingsFilePath = this.getOldPersistentSettingsPath(isInsiders, isOSS, isDev);
        if ((0, fs_extra_1.existsSync)(oldPersistentSettingsFilePath)) {
            const oldState = require(oldPersistentSettingsFilePath);
            this.setState(oldState);
            (0, fs_extra_1.unlinkSync)(oldPersistentSettingsFilePath);
        }
    }
    getState() {
        if (!(0, fs_extra_1.existsSync)(this.settings.persistentSettingsFilePath)) {
            return this.defaultState;
        }
        try {
            return require(this.settings.persistentSettingsFilePath);
        }
        catch (error) {
            // TODO: errorhandler
            // ErrorHandler.logError(error, true);
            console.log(error);
            return this.defaultState;
        }
    }
    setState(state) {
        try {
            (0, fs_extra_1.writeFileSync)(this.settings.persistentSettingsFilePath, JSON.stringify(state));
        }
        catch (error) {
            // TODO: errorhandler
            // ErrorHandler.logError(error, true);
            console.log(error);
        }
    }
    deleteState() {
        (0, fs_extra_1.unlinkSync)(this.settings.persistentSettingsFilePath);
    }
    updateStatus() {
        const state = this.getState();
        state.version = this.settings.extensionSettings.version;
        this.setState(state);
        return state;
    }
    isNewVersion() {
        const currentVersionInstalled = this.getState().version;
        // If is firstInstall
        return currentVersionInstalled === this.defaultState.version ? false : (0, semver_1.lt)(currentVersionInstalled, this.settings.extensionSettings.version);
    }
    isFirstInstall() {
        return this.getState().version === this.defaultState.version;
    }
    vscodeAppName(isInsiders, isOSS, isDev) {
        if (process.env['VSCODE_PORTABLE']) {
            return 'user-data';
        }
        if (isInsiders) {
            return 'Code - Insiders';
        }
        if (isOSS) {
            return 'Code - OSS';
        }
        if (isDev) {
            return 'code-oss-dev';
        }
        return 'Code';
    }
    vscodePath() {
        switch (process.platform) {
            case 'darwin':
                return `${os.homedir()}/Library/Application Support`;
            case 'linux':
                return `${os.homedir()}/.config`;
            case 'win32':
                return process.env['APPDATA'];
            default:
                return '/var/local';
        }
    }
}
exports.default = PersistentSettings;
