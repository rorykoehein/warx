// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Players as PlayersType, PlayerId } from '../types/game';
import PlayersContainer from '../../lib/styled/ShotsContainer';
import Player from '../../lib/styled/Player';

type Props = {
    players?: PlayersType,
    playerSize: number,
    step: number,
    currentPlayerId: PlayerId,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        players: state.players,
        playerSize: state.rules.playerSize,
        currentPlayerId: state.currentPlayerId,
    })
);

class Players extends PureComponent<Props> {

    static defaultProps = {
        playerSize: .6,
    };

    render() {
        const { players, playerSize, currentPlayerId, step } = this.props;
        const size = Math.round(step * playerSize);
        return (
            <PlayersContainer>
                {players && Object.keys(players).map(key => players[key].alive &&
                    <Player
                        key={key}
                        isCurrent={currentPlayerId === key}
                        x={Math.round(step * players[key].x)}
                        y={Math.round(step * players[key].y)}
                        size={size}
                        direction={players[key].direction}
                    />
                )}
            </PlayersContainer>
        )
    }
}

export default connector(Players);
