// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import MessagesContainer from '../../lib/styled/MessagesContainer';
import Message from '../../lib/styled/Message';

import type { Connector } from 'react-redux';
import type { State, MessagesType } from '../types/game';

type Props = {
    messages: MessagesType,
};

const connector: Connector<{}, Props> = connect((state : State) => ({
    messages: state.messages,
}));

class Messages extends PureComponent<Props> {
    static defaultProps = {
        messages: {},
    };

    render() {
        const { messages } = this.props;
        return (
            <MessagesContainer>
                {messages && Object.keys(messages)
                    .sort((a, b) => Number(b) - Number(a))
                    .map(key => <Message key={key}>{messages[key]}</Message>)}
            </MessagesContainer>
        )
    }
}

export default connector(Messages);
