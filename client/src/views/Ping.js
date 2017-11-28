// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import type { Connector } from 'react-redux';
import type { State } from '../types/game';

type Props = {
    latency?: number,
};

const connector: Connector<{}, Props> = connect((state : State) => ({
    latency: state.latency,
}));

class Ping extends PureComponent<Props> {
    render() {
        const { latency } = this.props;
        return latency !== null && <span>ping: {this.props.latency}</span>
    }
}

export default connector(Ping);