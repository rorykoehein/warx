import React from 'react';
import { TransitionGroup } from 'react-transition-group';

const time = 2000;

export default class ShotsContainer extends React.PureComponent {
    render() {
        return (
            <TransitionGroup>
                {this.props.children}
            </TransitionGroup>
        );
    }
}
