// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';

import { getRules } from '../state/module-game';
import { getShotsList } from '../state/module-shots';
import ShotsContainer from '../sprites/ShotsContainer';
import Shot from '../sprites/Shot';
import type { State, Shot as ShotType } from '../types/game';

type Props = {
    shots: Array<ShotType>,
    playerSize: number,
    step: number,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        shots: getShotsList(state),
        playerSize: getRules(state).playerSize,
    })
);

class Shots extends PureComponent<Props> {
    static defaultProps = {
        playerSize: .6,
    };

    render() {
        const { shots, playerSize, step } = this.props;
        const size = Math.round(step * playerSize);
        return (
            <ShotsContainer>
                {shots.map(shot =>
                    <Shot
                        key={shot.playerId}
                        x={Math.round(step * shot.x)}
                        y={Math.round(step * shot.y)}
                        size={size}
                        direction={shot.direction}
                    />
                )}
            </ShotsContainer>
        )
    }
}

export default connector(Shots);
