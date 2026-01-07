import {Actions, DatabaseStore, FocusedPerspectiveStore, MutableQuerySubscription, Thread} from 'mailspring-exports';

export class UnreadFirstFeature {

    private _enabled = false;
    private _focusUnlisten: any = null;
    private _patchedProto: any = null;
    private _originalMethod: any = null;

    constructor(private refreshCallback?: () => void) {}

    enable() {
        if (this._enabled) {
            return;
        }

        this._enabled = true;

        // react to inbox change event to start the code invasion,
        // in order to change the sorting, default mailbox view needs to be adjusted
        // with an addition sort criteria
        this._focusUnlisten = Actions.focusMailboxPerspective.listen((mailbox: any) => {
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
            proto.threads = function threadsUnreadFirst(this: any) {
                const query = DatabaseStore.findAll(Thread)
                    .where([Thread.attributes.categories.containsAny(this.categories().map((c: any) => c.id))])
                    .limit(0);

                // add sorting by 'unread' criteria
                if (this.isInbox()) {
                    query.order(
                        combineOrders(
                            Thread.attributes.unread.descending(),
                            Thread.attributes.lastMessageReceivedTimestamp.descending()
                        )
                    );
                }

                if (this.isSent()) {
                    query.order(Thread.attributes.lastMessageSentTimestamp.descending());
                }

                if (!['spam', 'trash'].includes(this.categoriesSharedRole())) {
                    query.where({ inAllMail: true });
                }

                if (this._categories.length > 1 && this.accountIds.length < this._categories.length) {
                    query.distinct();
                }

                return new MutableQuerySubscription(query, {
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
        Actions.focusMailboxPerspective(FocusedPerspectiveStore.current());

        console.log('[mailspring-toolbox-unread-first] enabled');
    }

    // hack to overcome the bug in mailspring https://github.com/Foundry376/Mailspring/pull/2530
    private combineOrders(primary: any, secondary: any) {
        const pSQL = primary.orderBySQL.bind(primary);
        const sSQL = secondary.orderBySQL.bind(secondary);
        primary.orderBySQL = (klass: any) => `${pSQL(klass)}, ${sSQL(klass)}`;
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
