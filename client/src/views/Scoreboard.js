// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { isScoreboardVisible, getPlayerScores, isSignedIn } from '../state/selectors';
import type { State, Player } from '../types/game';
import Overlay from '../sprites/Overlay';
import OverlayContainer from '../sprites/OverlayContainer';

type Props = {
    isSignedIn: boolean,
    isScoreboardVisible: boolean,
    players: Array<Player>,
};

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        isScoreboardVisible: isScoreboardVisible(state),
        players: getPlayerScores(state),
        isSignedIn: isSignedIn(state)
    })
);

class Scoreboard extends PureComponent<Props> {
    render() {
        const { isSignedIn, isScoreboardVisible, players } = this.props;
        console.log('isScoreboardVisible', isScoreboardVisible);
        return (
            <OverlayContainer>
                {(isSignedIn && isScoreboardVisible) ? (
                    <Overlay>
                        {players.map(player => (
                            <div>{player.name} {player.frags}/{player.deaths}</div>
                        ))}
                    </Overlay>
                ) : null}
            </OverlayContainer>
        )
    }
}

export default connector(Scoreboard);
