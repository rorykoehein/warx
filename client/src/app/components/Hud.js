// @flow

import React, { PureComponent } from 'react';
import type { Connector } from 'react-redux';
import HudContainer from '../../lib/styled/HudContainer';
import HudBottom from '../../lib/styled/HudBottom';
import WeaponLoader from './WeaponLoader';

class Hud extends PureComponent<> {
    render() {
        return (
            <HudContainer>
                <HudBottom>
                    <WeaponLoader />
                </HudBottom>
            </HudContainer>
        )
    }
}

export default Hud;