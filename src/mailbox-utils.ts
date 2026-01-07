const { Actions, FocusedPerspectiveStore, MailboxPerspective } = require("mailspring-exports");

export class MailboxUtils {

    private _refreshing = false;

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