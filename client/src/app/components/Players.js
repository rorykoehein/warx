// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Players as PlayersType } from '../types/game';
import Player from './Player';

type Props = {
    players?: PlayersType,
    playerSize: number,
    step: number,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        players: state.players,
        playerSize: state.rules.playerSize,
    })
);

class Players extends PureComponent<Props> {

    static defaultProps = {
        playerSize: .6,
    };

    render() {
        const { players, playerSize, step } = this.props;
        const size = Math.round(step * playerSize / 10);
        return (
            <div>
                {players && Object.keys(players).map(key => players[key].alive &&
                    <Player
                        key={key}
                        x={Math.round(step * players[key].x)}
                        y={Math.round(step * players[key].y)}
                        size={size}
                        direction={players[key].direction}
                    />
                )}
            </div>
        )
    }
}

export default connector(Players);
