// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HudContainer from '../../lib/styled/HudContainer';
import HudBottomCenter from '../../lib/styled/HudBottomCenter';
import HudTopRight from '../../lib/styled/HudTopRight';
import HudTopLeft from '../../lib/styled/HudTopLeft';
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
        return (
            <HudContainer>
                <HudTopLeft>
                    {this.props.latency}
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