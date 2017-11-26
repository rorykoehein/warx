import React from 'react';
import { TransitionGroup } from 'react-transition-group';

export default class ShotsContainer extends React.PureComponent {
    render() {
        return (
            <TransitionGroup>
                {this.props.children}
            </TransitionGroup>
        );
    }
}
