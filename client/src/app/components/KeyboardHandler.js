// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Dispatch, Direction, PlayerId } from '../types';
import { move } from '../actions';

type Props = {
    children?: any,
    currentPlayerId: PlayerId,
    onMove: ({ direction: Direction }) => void,
};

const left = 37;
const up = 38;
const right = 39;
const down = 40;

const mapStateToProps = (state: State) => ({ currentPlayerId: state.currentPlayerId });

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onMove: ({ direction, id }) => dispatch(move({ direction, id }))
});

const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchToProps);

class KeyboardHandler extends PureComponent<Props> {

    componentDidMount(){
        window.document.addEventListener('keyup', this.handleKey);
    }

    componentWillUnmount(){
        window.document.removeEventListener('keyup', this.handleKey);
    }

    handleKey = (event: KeyboardEvent) => {
        const { onMove, currentPlayerId } = this.props;
        switch (event.keyCode) {
            case left:
                onMove({ direction: 'left', id: currentPlayerId });
                break;
            case up:
                onMove({ direction: 'up', id: currentPlayerId });
                break;
            case right:
                onMove({ direction: 'right', id: currentPlayerId });
                break;
            case down:
                onMove({ direction: 'down', id: currentPlayerId });
                break;
        }
    };

    render() {
        console.log('this.props.currentPlayerId', this.props.currentPlayerId);
        return this.props.children;
    }
}

export default connector(KeyboardHandler);