// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { PlayerId } from '../types/game';
import type { Dispatch } from '../types/framework';
import { keyDown, keyUp } from '../actions';
import type { KeyDownAction, KeyUpAction } from '../types/actions';

type Props = {
    children?: any,
    currentPlayerId: PlayerId,
    keyDown: SyntheticKeyboardEvent<window.document> => KeyDownAction,
    keyUp: SyntheticKeyboardEvent<window.document> => KeyUpAction,
};

const empty = {};

const mapStateToProps = () => empty;

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // onMove: ({ direction }) => dispatch(selfMove({ direction })),
    // onShoot: () => dispatch(selfShotFire())
    keyDown: ({ key, repeat }) => repeat ? null : dispatch(keyDown({ key })),
    keyUp: ({ key }) => dispatch(keyUp({ key })),
});

const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchToProps);

class KeyboardHandler extends PureComponent<Props> {

    componentDidMount() {
        window.document.addEventListener('keydown', this.props.keyDown);
        window.document.addEventListener('keyup', this.props.keyUp);
    }

    componentWillUnmount() {
        window.document.removeEventListener('keydown', this.props.keyDown);
        window.document.removeEventListener('keyup', this.props.keyUp);
    }

    render() {
        return this.props.children;
    }
}

export default connector(KeyboardHandler);