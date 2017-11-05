// @flow

import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import Game from './Game';
import store from '../store';

type Props = {};

class App extends PureComponent<Props> {
    render() {
        return (
            <Provider store={store}>
                <Game />
            </Provider>
        );
    }
}

export default App;
