// @flow

import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import Stage from './Stage';
import store from '../store';

type Props = {};

class App extends PureComponent<Props> {
    render() {
        return (
            <Provider store={store}>
                <Stage />
            </Provider>
        );
    }
}

export default App;
