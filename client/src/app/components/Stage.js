// @flow

import React, { PureComponent } from 'react';
import type { Connector } from 'react-redux';
import KeyBoardHandler from './KeyboardHandler';
import World from './World';
import Hud from './Hud';
import SignIn from './SignIn';

export default class Stage extends PureComponent<{}> {
    render() {
        return (
            <KeyBoardHandler>
                <SignIn />
                <World />
                <Hud />
            </KeyBoardHandler>
        )
    }
}
