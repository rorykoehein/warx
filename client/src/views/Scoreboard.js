// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { isSignedIn } from '../state/selectors';
import { selectIsScoreboardVisible, selectPlayerScores } from '../state/scores';
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
        isScoreboardVisible: selectIsScoreboardVisible(state),
        players: selectPlayerScores(state),
        isSignedIn: isSignedIn(state)
    })
);

class Scoreboard extends PureComponent<Props> {
    render() {
        const { isSignedIn, isScoreboardVisible, players } = this.props;
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
