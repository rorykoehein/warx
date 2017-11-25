// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type {State, PlayerId, ExplosionsType} from '../types/game';
import ExplosionsContainer from '../../lib/styled/ExplosionsContainer';
import Explosion from '../../lib/styled/Explosion';

type Props = {
    explosions?: ExplosionsType,
    playerSize: number,
    step: number,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        explosions: state.explosions,
        playerSize: state.rules.playerSize,
    })
);

class Explosions extends PureComponent<Props> {

    render() {
        const { explosions, step, playerSize } = this.props;
        const size = Math.round(step * playerSize);
        return (
            <ExplosionsContainer>
                {explosions && Object.keys(explosions).map(key =>
                    <Explosion
                        key={key}
                        x={Math.round(step * explosions[key].x)}
                        y={Math.round(step * explosions[key].y)}
                        size={size}
                    />
                )}
            </ExplosionsContainer>
        )
    }
}

export default connector(Explosions);
