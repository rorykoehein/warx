// @flow
import { onNetworkAction } from '../socket';

import type { Store } from '../types/framework';

export const dispatchActions = (store: Store) => onNetworkAction(action => {
    // listen to server actions and map them to redux actions
    store.dispatch({
        ...action,
        origin: 'server',
        sendToServer: false,
    });
});
