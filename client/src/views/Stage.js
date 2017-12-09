// @flow

import React, { PureComponent } from 'react';
import type { Connector } from 'react-redux';
import KeyBoardHandler from './KeyboardHandler';
import World from './World';
import Hud from './Hud';
import SignIn from './SignIn';
import StageSprite from '../sprites/StageSprite';
import Scoreboard from './Scoreboard';

export default class Stage extends PureComponent<{}> {
    render() {
        return (
            <StageSprite>
                <KeyBoardHandler>
                    <SignIn />
                    <World />
                    <Hud />
                    <Scoreboard />
                </KeyBoardHandler>
            </StageSprite>
        )
    }
}
