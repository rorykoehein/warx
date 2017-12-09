// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import LargeInput from '../sprites/LargeInput';
import Overlay from '../sprites/Overlay';
import OverlayContainer from '../sprites/OverlayContainer';
import { selfJoin } from '../state/game';
import { isSignedIn } from '../state/game';

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
                        <form onSubmit={this.onSubmit}>
                            <LargeInput onChange={this.onChange} placeholder="Enter username to start..." autoFocus />
                        </form>
                    </Overlay>
                )}
            </OverlayContainer>
        );
    }
}

export default connector(SignIn);
