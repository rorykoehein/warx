// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Players } from '../types/game';
import WorldSprite from '../../lib/styled/WorldSprite';
import Player from './Player';
import KeyBoardHandler from './KeyboardHandler';

type Props = {
    players?: Players,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({ players: state.players })
);

class Game extends PureComponent<Props> {
    render() {
        const { players } = this.props;
        return (
            <KeyBoardHandler>
                <WorldSprite>
                    {players && Object.keys(players).map(key =>
                        <Player key={key} x={players[key].x} y={players[key].y} direction={players[key].direction} />
                    )}
                    {/* todo render shots */}
                    {/*{shots && Object.keys(shots).map(key =>*/}
                        {/*<Player key={key} x={players[key].x} y={players[key].y} direction={players[key].direction} />*/}
                    {/*)}*/}
                </WorldSprite>
            </KeyBoardHandler>
        )
    }
}

export default connector(Game);