// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Shots as ShotsType } from '../types/game';
import ShotsContainer from '../../lib/styled/ShotsContainer';
import Shot from '../../lib/styled/Shot';

type Props = {
    shots?: ShotsType,
    playerSize: number,
    step: number,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        shots: state.shots,
        playerSize: state.rules.playerSize,
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
                {shots && Object.keys(shots).map(key =>
                    <Shot
                        key={key}
                        x={Math.round(step * shots[key].x)}
                        y={Math.round(step * shots[key].y)}
                        size={size}
                        direction={shots[key].direction}
                    />
                )}
            </ShotsContainer>
        )
    }
}

export default connector(Shots);
