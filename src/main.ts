import {ComponentRegistry, WorkspaceStore} from "mailspring-exports";
import ThreadsOrderButton from "./toggle-threads-order-button";
import {CONFIG_KEYS} from "./config-keys";

let _disposer: any = null;

export function activate() {
    ComponentRegistry.register(ThreadsOrderButton, {
        location: WorkspaceStore.Location.RootSidebar.Toolbar,
    });

    _disposer = AppEnv.config.observe(CONFIG_KEYS.UNREAD_FIRST, (enabled: boolean) => {
        if (enabled) {
            enableUnreadFirst();
        } else {
            disableUnreadFirst();
        }
    });

    console.log('Mailspring Toolbox initialized.');
}

export function deactivate() {
    if (_disposer?.dispose) {
        _disposer.dispose();
    }
    _disposer = null;

    disableUnreadFirst();
}

function enableUnreadFirst() {
    console.log("Enable unread first");
}

function disableUnreadFirst() {
    console.log("Disable unread first");
}
