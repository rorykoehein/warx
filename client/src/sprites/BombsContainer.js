import React from 'react';
import { TransitionGroup } from 'react-transition-group';

export default class BombsContainer extends React.PureComponent {
    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
