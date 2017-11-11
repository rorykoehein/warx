// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Players, Shots } from '../types/game';

type Props = {
    reloadTime: number,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        reloadTime: state.rules.reloadTime,
    })
);

class Hud extends PureComponent<Props> {
    render() {
        const { reloadTime } = this.props;
        return (
            <div>

            </div>
        )
    }
}

export default connector(Hud);