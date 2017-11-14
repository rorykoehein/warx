// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import HudContainer from '../../lib/styled/HudContainer';
import HudBottom from '../../lib/styled/HudBottom';
import HudTopRight from '../../lib/styled/HudTopRight';
import WeaponLoader from './WeaponLoader';

import type { Connector } from 'react-redux';
import type { State } from '../types/game';

type Props = {
    latency: number,
};

const connector: Connector<{}, Props> = connect((state : State) => ({
    latency: state.latency,
}));

class Hud extends PureComponent<Props> {
    render() {
        return (
            <HudContainer>
                <HudTopRight>
                    {this.props.latency}
                </HudTopRight>
                <HudBottom>
                    <WeaponLoader />
                </HudBottom>
            </HudContainer>
        )
    }
}

export default connector(Hud);