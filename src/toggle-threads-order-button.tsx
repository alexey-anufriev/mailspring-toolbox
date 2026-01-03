import {localized, React} from 'mailspring-exports';
import {RetinaImg} from 'mailspring-component-kit';

export default class ThreadsOrderButton extends React.Component {

    static displayName = 'ThreadsOrderButton';

    _onApplyThreadsSort = () => {
        console.log('Handler');
    };

    render() {
        return (
            <button
                className="btn btn-toolbar"
                style={{order: 100}}
                title={localized('Unread first')}
                onClick={this._onApplyThreadsSort}>

                <RetinaImg
                    name="toolbar-markasunread.png"
                    mode={RetinaImg.Mode.ContentIsMask}/>
            </button>
        );
    }
}
