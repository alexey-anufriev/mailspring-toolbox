/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config-keys.ts"
/*!****************************!*\
  !*** ./src/config-keys.ts ***!
  \****************************/
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CONFIG_KEYS = void 0;
exports.CONFIG_KEYS = {
    UNREAD_FIRST: "mailspring-toolbox.unreadFirstEnabled",
};


/***/ },

/***/ "./src/mailbox-utils.ts"
/*!******************************!*\
  !*** ./src/mailbox-utils.ts ***!
  \******************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailboxUtils = void 0;
const { Actions, FocusedPerspectiveStore, MailboxPerspective } = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
class MailboxUtils {
    constructor() {
        this._refreshing = false;
    }
    refreshCurrentMailbox() {
        if (this._refreshing) {
            return;
        }
        const currentMailbox = FocusedPerspectiveStore.current();
        if (!currentMailbox) {
            return;
        }
        this._refreshing = true;
        // to force refresh it is required to bypass the check <current> equals <new> perspective
        // for this reason those should not be equal, thus setting empty perspective first
        Actions.focusMailboxPerspective(MailboxPerspective.forNothing());
        // running as a task to give UI enough time to re-render
        setTimeout(() => {
            Actions.focusMailboxPerspective(currentMailbox);
            this._refreshing = false;
        }, 0);
    }
}
exports.MailboxUtils = MailboxUtils;


/***/ },

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
const unread_first_button_1 = __importDefault(__webpack_require__(/*! ./unread-first-button */ "./src/unread-first-button.tsx"));
const config_keys_1 = __webpack_require__(/*! ./config-keys */ "./src/config-keys.ts");
const mailbox_utils_1 = __webpack_require__(/*! ./mailbox-utils */ "./src/mailbox-utils.ts");
const unread_first_feature_1 = __webpack_require__(/*! ./unread-first-feature */ "./src/unread-first-feature.ts");
const mailboxUtils = new mailbox_utils_1.MailboxUtils();
const unreadFirst = new unread_first_feature_1.UnreadFirstFeature(() => mailboxUtils.refreshCurrentMailbox());
let _unreadFirstDisposer = null;
function activate() {
    mailspring_exports_1.ComponentRegistry.register(unread_first_button_1.default, {
        location: mailspring_exports_1.WorkspaceStore.Location.RootSidebar.Toolbar,
    });
    _unreadFirstDisposer = AppEnv.config.observe(config_keys_1.CONFIG_KEYS.UNREAD_FIRST, (enabled) => {
        if (enabled) {
            unreadFirst.enable();
        }
        else {
            unreadFirst.disable();
        }
    });
    console.log('[mailspring-toolbox] initialized');
}
function deactivate() {
    if (_unreadFirstDisposer === null || _unreadFirstDisposer === void 0 ? void 0 : _unreadFirstDisposer.dispose) {
        _unreadFirstDisposer.dispose();
    }
    _unreadFirstDisposer = null;
    unreadFirst.disable();
}


/***/ },

/***/ "./src/unread-first-button.tsx"
/*!*************************************!*\
  !*** ./src/unread-first-button.tsx ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const mailspring_exports_1 = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
const mailspring_component_kit_1 = __webpack_require__(/*! mailspring-component-kit */ "mailspring-component-kit");
const config_keys_1 = __webpack_require__(/*! ./config-keys */ "./src/config-keys.ts");
class UnreadFirstButton extends mailspring_exports_1.React.Component {
    constructor(props) {
        super(props);
        this._onApplyThreadsSort = () => {
            const enabled = !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.UNREAD_FIRST);
            AppEnv.config.set(config_keys_1.CONFIG_KEYS.UNREAD_FIRST, !enabled);
        };
        this.state = {
            enabled: !!AppEnv.config.get(config_keys_1.CONFIG_KEYS.UNREAD_FIRST)
        };
    }
    componentDidMount() {
        this._disposer = AppEnv.config.observe(config_keys_1.CONFIG_KEYS.UNREAD_FIRST, (enabled) => {
            this.setState({ enabled: !!enabled });
        });
    }
    componentWillUnmount() {
        var _a;
        if ((_a = this._disposer) === null || _a === void 0 ? void 0 : _a.dispose) {
            this._disposer.dispose();
        }
        this._disposer = null;
    }
    render() {
        const { enabled } = this.state;
        const icon = enabled
            ? "toolbar-markasunread.png"
            : "toolbar-markasread.png";
        return (mailspring_exports_1.React.createElement("button", { className: "btn btn-toolbar", style: { order: 100 }, title: enabled ? "Unread first: ON" : "Unread first: OFF", onClick: this._onApplyThreadsSort },
            mailspring_exports_1.React.createElement(mailspring_component_kit_1.RetinaImg, { name: icon, mode: mailspring_component_kit_1.RetinaImg.Mode.ContentIsMask })));
    }
}
UnreadFirstButton.displayName = 'UnreadFirstButton';
exports["default"] = UnreadFirstButton;


/***/ },

/***/ "./src/unread-first-feature.ts"
/*!*************************************!*\
  !*** ./src/unread-first-feature.ts ***!
  \*************************************/
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnreadFirstFeature = void 0;
const mailspring_exports_1 = __webpack_require__(/*! mailspring-exports */ "mailspring-exports");
class UnreadFirstFeature {
    constructor(refreshCallback) {
        this.refreshCallback = refreshCallback;
        this._enabled = false;
        this._focusUnlisten = null;
        this._patchedProto = null;
        this._originalMethod = null;
    }
    enable() {
        if (this._enabled) {
            return;
        }
        this._enabled = true;
        // react to inbox change event to start the code invasion,
        // in order to change the sorting, default mailbox view needs to be adjusted
        // with an addition sort criteria
        this._focusUnlisten = mailspring_exports_1.Actions.focusMailboxPerspective.listen((mailbox) => {
            if (!this._enabled) {
                return;
            }
            // patch mailbox view only
            if (!mailbox || !mailbox.constructor || mailbox.constructor.name !== 'CategoryMailboxPerspective') {
                return;
            }
            const proto = Object.getPrototypeOf(mailbox);
            if (!proto) {
                return;
            }
            if (proto.threads && proto.threads.__unreadFirstPatched) {
                return;
            }
            this._patchedProto = proto;
            this._originalMethod = proto.threads;
            const combineOrders = this.combineOrders.bind(this);
            // mimic behavior of CategoryMailboxPerspective
            proto.threads = function threadsUnreadFirst() {
                const query = mailspring_exports_1.DatabaseStore.findAll(mailspring_exports_1.Thread)
                    .where([mailspring_exports_1.Thread.attributes.categories.containsAny(this.categories().map((c) => c.id))])
                    .limit(0);
                // add sorting by 'unread' criteria
                if (this.isInbox()) {
                    query.order(combineOrders(mailspring_exports_1.Thread.attributes.unread.descending(), mailspring_exports_1.Thread.attributes.lastMessageReceivedTimestamp.descending()));
                }
                if (this.isSent()) {
                    query.order(mailspring_exports_1.Thread.attributes.lastMessageSentTimestamp.descending());
                }
                if (!['spam', 'trash'].includes(this.categoriesSharedRole())) {
                    query.where({ inAllMail: true });
                }
                if (this._categories.length > 1 && this.accountIds.length < this._categories.length) {
                    query.distinct();
                }
                return new mailspring_exports_1.MutableQuerySubscription(query, {
                    emitResultSet: true,
                    updateOnSeparateThread: true,
                });
            };
            proto.threads.__unreadFirstPatched = true;
            // after patching once, no need to keep listening.
            if (this._focusUnlisten) {
                this._focusUnlisten();
                this._focusUnlisten = null;
            }
            this.refreshCallback();
        });
        // trigger fake reload to initiate patching
        mailspring_exports_1.Actions.focusMailboxPerspective(mailspring_exports_1.FocusedPerspectiveStore.current());
        console.log('[mailspring-toolbox-unread-first] enabled');
    }
    // hack to overcome the bug in mailspring https://github.com/Foundry376/Mailspring/pull/2530
    combineOrders(primary, secondary) {
        const pSQL = primary.orderBySQL.bind(primary);
        const sSQL = secondary.orderBySQL.bind(secondary);
        primary.orderBySQL = (klass) => `${pSQL(klass)}, ${sSQL(klass)}`;
        return primary;
    }
    disable() {
        this._enabled = false;
        if (this._focusUnlisten) {
            this._focusUnlisten();
            this._focusUnlisten = null;
        }
        if (this._patchedProto && this._originalMethod) {
            this._patchedProto.threads = this._originalMethod;
        }
        this._patchedProto = null;
        this._originalMethod = null;
        this.refreshCallback();
        console.log('[mailspring-toolbox-unread-first] disabled');
    }
}
exports.UnreadFirstFeature = UnreadFirstFeature;


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