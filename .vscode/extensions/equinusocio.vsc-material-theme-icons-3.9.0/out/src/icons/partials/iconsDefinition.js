"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("node:path");
const fs = require("fs-extra");
const paths_1 = require("../../../builder/helpers/paths");
/**
 * Remove the extension from a file name (eg. "file.svg")
 * @param fileName {string} Filename string
 */
const removeFileExtension = (fileName) => fileName.replace(/\.[^/.]+$/, '');
/**
 * Get all the svg icons from the svgs
 * source path and remove the file extension
 */
const iconsList = fs.readdirSync(path.resolve(paths_1.PATHS.srcSvgs)).map((icon) => {
    if (/\.svg$/i.exec(icon)) {
        return removeFileExtension(icon);
    }
    return '';
});
/**
 * Define the Icon object constructor
 * to build the icon object schema
 * required by the theme
 * @param path {String} is the filename path
 */
class Icon {
    constructor(path) {
        let iconName = '';
        if (path.indexOf('folder')) {
            if (path.indexOf('file')) {
                iconName = `_file_${path}`;
            }
            else {
                iconName = `_${path}`;
            }
        }
        else {
            iconName = `_${path}`;
        }
        this[iconName] = {
            iconPath: `../icons/${path}.svg`,
        };
    }
}
/**
 * For each files found in `iconsList`
 * call the Icon contructor and generate the
 * full json theme
 */
const icons = iconsList.reduce((acc, icon) => {
    const iconFromSvg = new Icon(icon);
    acc.iconDefinitions = Object.assign(Object.assign({}, acc.iconDefinitions), iconFromSvg);
    return acc;
}, { iconDefinitions: {} });
exports.default = icons;
