import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { injectGlobal } from "styled-components";

const time = 250;

injectGlobal`
    .messages-container-item {
        // the double class name is to add more specifity
        &-enter&-enter {
            opacity: 0.01;
        }
        
        &-enter&-enter-active {
            opacity: 1;
            transition: opacity ${time}ms ease-in;        
        }
        
        &-exit&-exit {
            opacity: 1;
        }
        
        &-exit&-exit-active {
            opacity: 0.01;
            transition: opacity ${time}ms ease-in;
        }
    }
`;

export default class MessagesContainer extends React.PureComponent {
    render() {
        return (
            <TransitionGroup className='message-container'>
                {React.Children.map(this.props.children, (child) => (
                    <CSSTransition timeout={time} classNames="messages-container-item">
                        {child}
                    </CSSTransition>
                ))}
            </TransitionGroup>
        );
    }
}
