"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILES = exports.PATHS = void 0;
const node_path_1 = require("node:path");
exports.PATHS = {
    rootDir: (0, node_path_1.join)(__dirname, '../../../'), // From `out` dir
    extensionDir: (0, node_path_1.join)(__dirname, '../../'), // From `out` dir
    defaults: './src/defaults.json',
    package: './package.json',
};
exports.FILES = {
    persistentSettings: 'eq-material-theme-icons.json',
};
