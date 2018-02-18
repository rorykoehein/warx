// @flow

import React, { PureComponent } from 'react';
import type { Connector } from 'react-redux';
import KeyBoardHandler from './KeyboardHandler';
import World from './World';
import Hud from './Hud';
import SignIn from './SignIn';
import Link from '../sprites/Link';
import SourceLink from '../sprites/SourceLink';
import Scenery from '../sprites/Scenery';
import StageSprite from '../sprites/StageSprite';
import Scoreboard from './Scoreboard';

export default class Stage extends PureComponent<{}> {
    render() {
        return (
            <StageSprite>
                <Scenery />
                <KeyBoardHandler>
                    <SignIn />
                    <World />
                    <Hud />
                    <Scoreboard />
                    <SourceLink>
                        <Link href="https://github.com/nextminds/warx">source and issues</Link>
                    </SourceLink>
                </KeyBoardHandler>
            </StageSprite>
        )
    }
}
