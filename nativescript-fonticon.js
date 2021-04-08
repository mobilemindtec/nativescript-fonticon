"use strict";
exports.__esModule = true;
var file_system_1 = require("@narivescript/core/file-system");
var lib = require("./lib");
var TNSFontIcon = /** @class */ (function () {
    function TNSFontIcon() {
    }
    TNSFontIcon.loadCss = function (css_json) {
        var cnt = 0;
        var currentName;
        var fontIconCollections = Object.keys(TNSFontIcon.paths);
        if (TNSFontIcon.debug) {
            console.log("Collections to load: " + fontIconCollections);
        }

        var initCollection = function () {
            currentName = fontIconCollections[cnt];
            TNSFontIcon.css[currentName] = {};
        };

        if(css_json){

            console.log("Fonticon: use fonts from json object")

            initCollection()
            var map = lib.mapCss2(css_json, TNSFontIcon.debug);
            TNSFontIcon.css[currentName] = map;

            return new Promise(function (resolve,reject){resolve()})
        }

        var loadFile = function (path) {
            if (TNSFontIcon.debug) {
                console.log('----------');
                console.log("Loading collection '" + currentName + "' from file: " + path);
            }
            var cssFile = file_system_1.knownFolders.currentApp().getFile(path);

            console.log("cssFile = " + file_system_1.File.exists(path))

            return new Promise(function (resolve, reject) {
                cssFile.readText().then(function (data) {
                    var map = lib.mapCss(data, TNSFontIcon.debug);
                    TNSFontIcon.css[currentName] = map;
                    resolve();
                }, function (err) {
                    reject(err);
                });
            });
        };
        var loadFiles = function () {
            return new Promise(function (resolve) {
                initCollection();
                if (cnt < fontIconCollections.length) {
                    loadFile(TNSFontIcon.paths[currentName]).then(function () {
                        cnt++;
                        return loadFiles().then(function () {
                            resolve();
                        });
                    });
                }
                else {
                    resolve();
                }
            });
        };
        return loadFiles();
    };
    TNSFontIcon.css = {}; // font icon collections containing maps of classnames to unicode
    TNSFontIcon.paths = {}; // file paths to font icon collections
    TNSFontIcon.debug = false;
    return TNSFontIcon;
}());
exports.TNSFontIcon = TNSFontIcon;
function fonticon(value) {
    if (value) {
        if (value.indexOf('-') > -1) {
            var prefix = value.split('-')[0];
            var result = TNSFontIcon.css[prefix][value];            
            //console.log("font result: " + value + ": " + result)
            
            return result
        }
        else {
            console.log('Fonticon classname ['+value+'] did not contain a prefix. i.e., \'fa-bluetooth\'');
        }
    }
    return value;
}
exports.fonticon = fonticon;
