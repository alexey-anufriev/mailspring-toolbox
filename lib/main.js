/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts"
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const mailspring_exports_1 = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
const toggle_threads_order_button_1 = __importDefault(__webpack_require__(/*! ./toggle-threads-order-button */ "./src/toggle-threads-order-button.tsx"));
function activate() {
    console.log('Mailspring Toolbox initialized.');
    mailspring_exports_1.ComponentRegistry.register(toggle_threads_order_button_1.default, {
        location: mailspring_exports_1.WorkspaceStore.Location.RootSidebar.Toolbar,
    });
}
function deactivate() {
}


/***/ },

/***/ "./src/toggle-threads-order-button.tsx"
/*!*********************************************!*\
  !*** ./src/toggle-threads-order-button.tsx ***!
  \*********************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mailspring_exports_1 = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
const mailspring_component_kit_1 = __webpack_require__(/*! mailspring-component-kit */ "mailspring-component-kit");
class ThreadsOrderButton extends mailspring_exports_1.React.Component {
    constructor() {
        super(...arguments);
        this._onApplyThreadsSort = () => {
            console.log('Handler');
        };
    }
    render() {
        return (mailspring_exports_1.React.createElement("button", { className: "btn btn-toolbar", style: { order: 100 }, title: (0, mailspring_exports_1.localized)('Unread first'), onClick: this._onApplyThreadsSort },
            mailspring_exports_1.React.createElement(mailspring_component_kit_1.RetinaImg, { name: "toolbar-markasunread.png", mode: mailspring_component_kit_1.RetinaImg.Mode.ContentIsMask })));
    }
}
ThreadsOrderButton.displayName = 'ThreadsOrderButton';
exports["default"] = ThreadsOrderButton;


/***/ },

/***/ "mailspring-component-kit"
/*!*******************************************!*\
  !*** external "mailspring-component-kit" ***!
  \*******************************************/
(module) {

module.exports = require("mailspring-component-kit");

/***/ },

/***/ "mailspring-exports"
/*!*************************************!*\
  !*** external "mailspring-exports" ***!
  \*************************************/
(module) {

module.exports = require("mailspring-exports");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map