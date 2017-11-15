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
    worldWidth: number,
    worldHeight: number,
    playerSize: number,
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
        worldWidth: state.rules.worldWidth,
        worldHeight: state.rules.worldHeight,
        playerSize: state.rules.playerSize,
    })
);

class World extends PureComponent<Props, WorldState> {

    static defaultProps = {
        worldWidth: 100,
        worldHeight: 50,
        playerSize: .6,
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
        const { players, shots, worldWidth, worldHeight, playerSize } = this.props;
        const { size: { width, height } } = this.state;
        const size = (width > height ? width / 1000 : height / 1000) * playerSize;
        const ratio = worldWidth / worldHeight;
        // todo: only 100x50 ratio works, with a ratio of 100*100 the player moves horizontally faster than vertically
        return (
            <WorldSprite ref={ref => this.world = ref} ratio={ratio}>
                {players && Object.keys(players).map(key => players[key].alive &&
                    <Player
                        key={key}
                        x={width/worldWidth * players[key].x}
                        y={height/worldHeight * players[key].y}
                        size={size}
                        direction={players[key].direction}
                    />
                )}
                {shots && Object.keys(shots).map(key =>
                    <Shot
                        key={key}
                        x={width/worldWidth * shots[key].x}
                        y={height/worldHeight * shots[key].y}
                        size={size}
                        direction={shots[key].direction}
                    />
                )}
            </WorldSprite>
        )
    }
}

export default connector(World);
