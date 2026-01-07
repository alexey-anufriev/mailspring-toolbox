import {React} from 'mailspring-exports';
import {RetinaImg} from 'mailspring-component-kit';
import {CONFIG_KEYS} from "./config-keys";

export default class UnreadFirstButton extends React.Component<{}, { enabled: boolean }> {

    static displayName = 'UnreadFirstButton';

    private _disposer: any;

    constructor(props: {}) {
        super(props);

        this.state = {
            enabled: !!AppEnv.config.get(CONFIG_KEYS.UNREAD_FIRST)
        };
    }

    componentDidMount() {
        this._disposer = AppEnv.config.observe(CONFIG_KEYS.UNREAD_FIRST, (enabled: boolean) => {
            this.setState({enabled: !!enabled});
        });
    }

    componentWillUnmount() {
        if (this._disposer?.dispose) {
            this._disposer.dispose();
        }

        this._disposer = null;
    }

    _onApplyThreadsSort = () => {
        const enabled = !!AppEnv.config.get(CONFIG_KEYS.UNREAD_FIRST);
        AppEnv.config.set(CONFIG_KEYS.UNREAD_FIRST, !enabled);
    };

    render() {
        const {enabled} = this.state;

        const icon = enabled
            ? "toolbar-markasunread.png"
            : "toolbar-markasread.png";

        return (
            <button
                className="btn btn-toolbar"
                style={{order: 100}}
                title={enabled ? "Unread first: ON" : "Unread first: OFF"}
                onClick={this._onApplyThreadsSort}>

                <RetinaImg
                    name={icon}
                    mode={RetinaImg.Mode.ContentIsMask}/>
            </button>
        );
    }
}
