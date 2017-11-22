// @flow

import React, { PureComponent } from 'react';
import LargeInput from '../../lib/styled/LargeInput';
import Overlay from '../../lib/styled/Overlay';
import { connect } from 'react-redux';
import { selfJoin } from '../actions';

import type { Connector } from 'react-redux';
import type { Dispatch } from '../types/framework';

type State = {
    value: string,
};
type Props = {
    onSubmit: (value: string) => void,
};

const connector: Connector<{}, Props> = connect(
    () => ({}),
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
        return (
            <Overlay>
                <form onSubmit={this.onSubmit}>
                    <LargeInput onChange={this.onChange} />
                </form>
            </Overlay>
        );
    }
}

export default connector(SignIn);
