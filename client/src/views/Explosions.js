// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getExplosionsList, getRules } from '../state/selectors';
import type { State, Explosion as ExplosionType } from '../types/game';
import ExplosionsContainer from '../sprites/ExplosionsContainer';
import Explosion from '../sprites/Explosion';

type Props = {
    explosions: Array<ExplosionType>,
    playerSize: number,
    step: number,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        explosions: getExplosionsList(state),
        playerSize: getRules(state).playerSize,
    })
);

class Explosions extends PureComponent<Props> {
    render() {
        const { explosions, step } = this.props;
        return (
            <ExplosionsContainer>
                {explosions.map(explosion =>
                    <Explosion
                        key={explosion.id}
                        x={Math.round(step * explosion.x)}
                        y={Math.round(step * explosion.y)}
                        size={step * explosion.size}
                    />
                )}
            </ExplosionsContainer>
        )
    }
}

export default connector(Explosions);
