// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { PlayerId } from '../types/game';
import type { Dispatch } from '../types/framework';
import { keyDown, keyUp } from '../state/actions';
import type { KeyDownAction, KeyUpAction } from '../types/actions';

type Props = {
    children?: any,
    currentPlayerId: PlayerId,
    keyDown: SyntheticKeyboardEvent<window.document> => KeyDownAction,
    keyUp: SyntheticKeyboardEvent<window.document> => KeyUpAction,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    keyDown: ({ key, repeat }) => repeat ? null : dispatch(keyDown({ key })),
    keyUp: ({ key }) => dispatch(keyUp({ key })),
});

const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchToProps);

class KeyboardHandler extends PureComponent<Props> {

    componentDidMount() {
        if(window) {
            window.document.addEventListener('keydown', this.props.keyDown);
            window.document.addEventListener('keyup', this.props.keyUp);
        }
    }

    componentWillUnmount() {
        if(window) {
            window.document.removeEventListener('keydown', this.props.keyDown);
            window.document.removeEventListener('keyup', this.props.keyUp);
        }
    }

    render() {
        return this.props.children;
    }
}

export default connector(KeyboardHandler);