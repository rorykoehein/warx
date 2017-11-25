// @flow

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import type { State } from '../types/game';
import WorldSprite from '../../lib/styled/WorldSprite';
import Players from './Players';
import Explosions from './Explosions';
import Shots from './Shots';

type Props = {
    worldWidth: number,
    worldHeight: number,
};

type WorldState = {
    size: {
        width: number,
        height: number,
    }
}

const connector: Connector<{}, Props> = connect(
    (state: State) => ({
        worldWidth: state.rules.worldWidth,
        worldHeight: state.rules.worldHeight,
    })
);

class World extends PureComponent<Props, WorldState> {

    static defaultProps = {
        worldWidth: 100,
        worldHeight: 50,
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
        const { worldWidth, worldHeight } = this.props;
        const { size: { width } } = this.state;
        const ratio = worldWidth / worldHeight;
        const step = width/worldWidth;
        // todo: only 100x50 ratio works, with a ratio of 100*100 the player moves horizontally faster than vertically
        return (
            <WorldSprite ref={ref => this.world = ref} ratio={ratio}>
                <Players step={step} />
                <Shots step={step} />
                <Explosions step={step} />
            </WorldSprite>
        )
    }
}

export default connector(World);
