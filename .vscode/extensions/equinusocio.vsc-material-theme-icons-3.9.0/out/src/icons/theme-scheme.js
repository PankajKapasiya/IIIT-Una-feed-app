"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileExtensions_1 = require("./partials/fileExtensions");
const fileFolders_1 = require("./partials/fileFolders");
const fileNames_1 = require("./partials/fileNames");
const folderNames_1 = require("./partials/folderNames");
const folderNamesExpanded_1 = require("./partials/folderNamesExpanded");
const iconsDefinition_1 = require("./partials/iconsDefinition");
const languageIds_1 = require("./partials/languageIds");
/**
 * Define the icon theme json schema required
 * by vscode extensions api
 */
exports.default = Object.assign(Object.assign(Object.assign({ 
    // Disable arrows beside folders
    hidesExplorerArrows: true }, iconsDefinition_1.default), fileFolders_1.fileFolders), { 
    // Push file extension declarations
    fileExtensions: fileExtensions_1.fileExtensions,
    // Push file names declarations
    fileNames: fileNames_1.fileNames,
    // Push folder names declarations
    folderNames: folderNames_1.folderNames,
    // Push expanded folder names declarations
    folderNamesExpanded: folderNamesExpanded_1.folderNamesExpanded,
    // Push languages ids declarations
    languageIds: languageIds_1.languageIds });
