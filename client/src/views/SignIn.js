// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import LargeButton from '../sprites/LargeButton';
import LargeInput from '../sprites/LargeInput';
import SignInForm from '../sprites/SignInForm';
import IntroText from '../sprites/IntroText';
import Link from '../sprites/Link';
import Overlay from '../sprites/Overlay';
import OverlayContainer from '../sprites/OverlayContainer';
import KeyInstructions from '../sprites/KeyInstructions';
import KeyInstruction from '../sprites/KeyInstruction';
import Key from '../sprites/Key';
import { selfJoin } from '../state/module-players';
import { isSignedIn } from '../state/module-players';

import type { Connector } from 'react-redux';
import type { Dispatch } from '../types/framework';
import type { State as AppState } from '../types/game';

type State = {
    value: string,
};

type Props = {
    onSubmit: (value: string) => void,
    isSignedIn: boolean,
};

const connector: Connector<{}, Props> = connect(
    (state: AppState) => ({
        isSignedIn: isSignedIn(state)
    }),
    (dispatch: Dispatch) => ({
        onSubmit: (playerName) => dispatch(selfJoin({ playerName })),
    })
);

class SignIn extends PureComponent<Props, State> {
    state = { value: '' };

    onChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
        this.setState({ value: event.target.value })
    };

    onSubmit = (event) => {
        event.preventDefault();
        const value = this.state.value.slice(0, 20).trim();
        if(value) {
            this.props.onSubmit(value);
        }
    };

    render() {
        const { isSignedIn } = this.props;
        return (
            <OverlayContainer>
                {isSignedIn ? null : (
                    <Overlay>
                        <KeyInstructions>
                            <KeyInstruction instruction="Move">
                                <Key>&larr;</Key>
                                <Key>&uarr;</Key>
                                <Key>&rarr;</Key>
                                <Key>&darr;</Key>
                            </KeyInstruction>
                            <KeyInstruction instruction="Shoot">
                                <Key>Space</Key>
                            </KeyInstruction>
                            <KeyInstruction instruction="Toggle highscores">
                                <Key>H</Key>
                            </KeyInstruction>
                        </KeyInstructions>
                        <SignInForm onSubmit={this.onSubmit}>
                            <LargeInput
                                onChange={this.onChange}
                                placeholder="Enter player name to start"
                                autoFocus
                                maxLength={20}
                            />
                            <LargeButton>Go</LargeButton>
                        </SignInForm>
                        <IntroText>
                            WARX is a silly little game built with Javascript,
                            React and Redux. Contribute and file issues on <Link
                            href="https://github.com/nextminds/warx">github</Link>.
                        </IntroText>
                    </Overlay>
                )}
            </OverlayContainer>
        );
    }
}

export default connector(SignIn);
