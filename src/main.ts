import {ComponentRegistry, WorkspaceStore} from "mailspring-exports";
import ThreadsOrderButton from "./toggle-threads-order-button";

export function activate() {
    console.log('Mailspring Toolbox initialized.');

    ComponentRegistry.register(ThreadsOrderButton, {
        location: WorkspaceStore.Location.RootSidebar.Toolbar,
    });
}

export function deactivate() {

}
