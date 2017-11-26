import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { injectGlobal } from "styled-components";

const time = 500;

injectGlobal`
    .overlay-container-inner {
        // the double class name is to add more specificity
        &-enter&-enter {
            opacity: 0.01;
        }
        
        &-enter&-enter-active {
            opacity: 1;
            transition: opacity ${time}ms ease-in;        
        }
        
        &-exit&-exit {
            opacity: 1;
            transform: scale(1);
        }
        
        &-exit&-exit-active {
            opacity: 0.01;
            transform: scaleX(5) scaleY(10);
            transition: opacity ${time}ms ease-out, transform ${time}ms ease-out;
        }
    }
`;

export default class OverlayContainer extends React.PureComponent {
    render() {
        const children = this.props.children;
        return (
            <TransitionGroup className='overlay-container'>
                {children
                    ? <CSSTransition timeout={time} classNames="overlay-container-inner">{children}</CSSTransition>
                    : null
                }
            </TransitionGroup>
        );
    }
}
