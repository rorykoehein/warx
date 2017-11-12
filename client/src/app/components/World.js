// @flow

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State, Players, Shots } from '../types/game';
import WorldSprite from '../../lib/styled/WorldSprite';
import Shot from './Shot';
import Player from './Player';

type Props = {
    players?: Players,
    shots?: Shots,
    worldRatio: number,
};

type WorldState = {
    size: {
        width: number,
        height: number,
    }
}

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        players: state.players,
        shots: state.shots,
        worldRatio: state.rules.worldRatio,
    })
);

class World extends PureComponent<Props, WorldState> {

    static defaultProps = {
        worldRatio: .5
    };

    state = {
        size: { width: 1000, height: 500 }
    };

    world = null;

    componentDidMount() {
        this.updateOffset();
        window.addEventListener("resize", this.updateOffset);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateOffset);
    }

    // todo debounce
    updateOffset = () => {
        // todo this view shouldn't know anything about the dom, the positioning should be handled by the next layer
        const node = ReactDOM.findDOMNode(this.world);
        if(node && node instanceof HTMLElement) {
            const { width, height } = node.getBoundingClientRect();
            this.setState({
                size: { width, height }
            });
        }
    };

    render() {
        const { players, shots, worldRatio } = this.props;
        const { size: { width, height } } = this.state;
        // the world has a certain ratio, which it gets from the game rules, for instance .5, which means width is twice
        // the height, we want a horizontal step, to be the same as a vertical step
        const worldWidth = worldRatio <= 1 ? 100: 100 * worldRatio;
        const worldHeight = worldRatio <= 1 ? 100 * worldRatio : 100;
        return (
            <WorldSprite ref={ref => this.world = ref}>
                {players && Object.keys(players).map(key => players[key].alive &&
                    <Player
                        key={key}
                        x={width/worldWidth * players[key].x}
                        y={height/worldHeight * players[key].y}
                        direction={players[key].direction}
                    />
                )}
                {shots && Object.keys(shots).map(key =>
                    <Shot
                        key={key}
                        x={width/worldWidth * shots[key].x}
                        y={height/worldHeight * shots[key].y}
                        direction={shots[key].direction}
                    />
                )}
            </WorldSprite>
        )
    }
}

export default connector(World);
