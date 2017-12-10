// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import MessagesContainer from '../sprites/MessagesContainer';
import Message from '../sprites/Message';
import { getMessagesByLatest } from '../state/module-messages';

import type { Connector } from 'react-redux';
import type { State, MessageList } from '../types/game';

type Props = {
    messages: MessageList,
};

const connector: Connector<{}, Props> = connect((state : State) => ({
    messages: getMessagesByLatest(state),
}));

class Messages extends PureComponent<Props> {
    static defaultProps = {
        messages: [],
    };

    render() {
        const { messages } = this.props;
        return (
            <MessagesContainer>
                {messages.map(message => <Message key={message.id}>{message.text}</Message>)}
            </MessagesContainer>
        )
    }
}

export default connector(Messages);
