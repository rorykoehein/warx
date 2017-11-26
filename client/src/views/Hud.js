// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HudContainer from '../sprites/HudContainer';
import HudBottomCenter from '../sprites/HudBottomCenter';
import HudTopRight from '../sprites/HudTopRight';
import HudTopLeft from '../sprites/HudTopLeft';
import WeaponLoader from './WeaponLoader';
import Messages from './Messages';

import type { Connector } from 'react-redux';
import type { State } from '../types/game';

type Props = {
    latency?: number,
};

const connector: Connector<{}, Props> = connect((state : State) => ({
    latency: state.latency,
}));

class Hud extends PureComponent<Props> {
    render() {
        const { latency } = this.props;
        return (
            <HudContainer>
                <HudTopLeft>
                    {latency !== null && <span>ping: {this.props.latency}</span>}
                </HudTopLeft>
                <HudTopRight>
                    <Messages />
                </HudTopRight>
                <HudBottomCenter>
                    <WeaponLoader />
                </HudBottomCenter>
            </HudContainer>
        )
    }
}

export default connector(Hud);