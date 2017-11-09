// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Direction, PlayerId } from '../types/game';
import type { Dispatch } from '../types/framework';
import { move, selfShotFire } from '../actions';

type Props = {
    children?: any,
    currentPlayerId: PlayerId,
    onMove: ({ direction: Direction, playerId: PlayerId }) => void,
    onShoot: () => void,
};

const left = 37;
const up = 38;
const right = 39;
const down = 40;
const space = 32;

const mapStateToProps = (state: State) => ({ currentPlayerId: state.currentPlayerId });

const mapDispatchToProps = (dispatch: Dispatch) => ({
    onMove: ({ direction, playerId }) => dispatch(move({ direction, playerId })),
    onShoot: () => dispatch(selfShotFire())
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
        const { onMove, onShoot, currentPlayerId } = this.props;
        switch (event.keyCode) {
            case left:
                onMove({ direction: 'left', playerId: currentPlayerId });
                break;
            case up:
                onMove({ direction: 'up', playerId: currentPlayerId });
                break;
            case right:
                onMove({ direction: 'right', playerId: currentPlayerId });
                break;
            case down:
                onMove({ direction: 'down', playerId: currentPlayerId });
                break;
            case space:
                onShoot();
                break;
        }
    };

    render() {
        console.log('this.props.currentPlayerId', this.props.currentPlayerId);
        return this.props.children;
    }
}

export default connector(KeyboardHandler);