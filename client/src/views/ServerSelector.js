// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { getServerList } from '../state/module-servers';
import type { ServerList } from '../state/module-servers';
import type { State, PlayerList, PlayerId } from '../types/game';
// import type { Servers } from "../../../server/state/module-servers"; // todo

// type State = {
//     // servers: Servers,
// };

type Props = {
    servers: ServerList,
};

const connector: Connector<{}, Props> = connect(
    (state) => ({
        servers: getServerList(state)
    }),
    (dispatch: Dispatch) => ({

    })
);

class ServerSelector extends PureComponent<Props, State> {
    render() {
        return (
            <div>
                <select name="select server" style={{ color: 'white' }}>
                    {this.props.servers.map(server => (
                        <option value={server.address}>{server.name}</option>
                    ))}
                </select>
            </div>
        );
    }

}

export default connector(ServerSelector);
