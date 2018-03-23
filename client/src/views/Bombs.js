// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import BombsContainer from '../sprites/BombsContainer';
import Bomb from '../sprites/Bomb';
import { getRules } from '../state/module-game';
import { getBombList } from '../state/module-bombs';

import type { Connector } from 'react-redux';
import type {PlayerId, State} from '../types/game';
import type { BombList } from '../state/module-bombs';
import {getCurrentPlayerId} from "../state/module-players";

type Props = {
    bombs: BombList,
    playerSize: number,
    step: number,
    currentPlayerId: PlayerId,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        bombs: getBombList(state),
        playerSize: getRules(state).playerSize,
        currentPlayerId: getCurrentPlayerId(state),
    })
);

class Bombs extends PureComponent<Props> {
    render() {
        const { bombs, playerSize, currentPlayerId, step } = this.props;
        const size = Math.round(step * playerSize);
        return (
            <BombsContainer>
                {bombs.map(bomb =>
                    <Bomb
                        key={bomb.id}
                        x={Math.round(step * bomb.x)}
                        y={Math.round(step * bomb.y)}
                        size={size}
                        isCurrent={currentPlayerId === bomb.id}
                    />
                )}
            </BombsContainer>
        )
    }
}

export default connector(Bombs);
