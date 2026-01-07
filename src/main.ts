import {ComponentRegistry, WorkspaceStore} from "mailspring-exports";
import UnreadFirstButton from "./unread-first-button";
import {CONFIG_KEYS} from "./config-keys";
import {MailboxUtils} from "./mailbox-utils";
import {UnreadFirstFeature} from "./unread-first-feature";

const mailboxUtils = new MailboxUtils();
const unreadFirst = new UnreadFirstFeature(() => mailboxUtils.refreshCurrentMailbox());

let _unreadFirstDisposer: any = null;

export function activate() {
    ComponentRegistry.register(UnreadFirstButton, {
        location: WorkspaceStore.Location.RootSidebar.Toolbar,
    });

    _unreadFirstDisposer = AppEnv.config.observe(CONFIG_KEYS.UNREAD_FIRST, (enabled: boolean) => {
        if (enabled) {
            unreadFirst.enable();
        } else {
            unreadFirst.disable();
        }
    });

    console.log('[mailspring-toolbox] initialized');
}

export function deactivate() {
    if (_unreadFirstDisposer?.dispose) {
        _unreadFirstDisposer.dispose();
    }
    _unreadFirstDisposer = null;

    unreadFirst.disable();
}
