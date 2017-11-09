// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Players, Shots } from '../types/game';
import WorldSprite from '../../lib/styled/WorldSprite';
import KeyBoardHandler from './KeyboardHandler';
import Shot from './Shot';
import Player from './Player';

type Props = {
    players?: Players,
    shots?: Shots,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        players: state.players,
        shots: state.shots,
    })
);

class Game extends PureComponent<Props> {
    render() {
        const { players, shots } = this.props;
        return (
            <KeyBoardHandler>
                <WorldSprite>
                    {players && Object.keys(players).map(key => players[key].alive &&
                        <Player key={key} x={players[key].x} y={players[key].y} direction={players[key].direction} />
                    )}
                    {shots && Object.keys(shots).map(key =>
                        <Shot key={key} x={shots[key].x} y={shots[key].y} direction={shots[key].direction} />
                    )}
                </WorldSprite>
            </KeyBoardHandler>
        )
    }
}

export default connector(Game);