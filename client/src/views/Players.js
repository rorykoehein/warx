// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, PlayerList, PlayerId } from '../types/game';
import PlayersContainer from '../sprites/PlayersContainer';
import Player from '../sprites/Player';
import { getRules } from '../state/game';
import { getAlivePlayers, getCurrentPlayerId } from '../state/players';

type Props = {
    players: PlayerList,
    playerSize: number,
    step: number,
    currentPlayerId: PlayerId,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        players: getAlivePlayers(state),
        playerSize: getRules(state).playerSize,
        currentPlayerId: getCurrentPlayerId(state),
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
                {players.map(player =>
                    <Player
                        key={player.id}
                        isCurrent={currentPlayerId === player.id}
                        x={Math.round(step * player.x)}
                        y={Math.round(step * player.y)}
                        size={size}
                        direction={player.direction}
                    />
                )}
            </PlayersContainer>
        )
    }
}

export default connector(Players);
