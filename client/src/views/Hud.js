// @flow

import React, { PureComponent } from 'react';
import HudContainer from '../sprites/HudContainer';
import HudBottomCenter from '../sprites/HudBottomCenter';
import HudTopRight from '../sprites/HudTopRight';
import HudTopLeft from '../sprites/HudTopLeft';
import WeaponLoader from './WeaponLoader';
import Messages from './Messages';
import Ping from './Ping';

class Hud extends PureComponent<{}> {
    render() {
        return (
            <HudContainer>
                <HudTopLeft>
                    <Ping />
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

export default Hud;