// @flow

import React, { PureComponent } from 'react';
import type { Connector } from 'react-redux';
import KeyBoardHandler from './KeyboardHandler';
import World from './World';
import Hud from './Hud';

export default class Stage extends PureComponent<{}> {
    render() {
        return (
            <KeyBoardHandler>
                <World />
                <Hud />
            </KeyBoardHandler>
        )
    }
}
