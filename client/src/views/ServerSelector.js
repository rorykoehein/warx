// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getServerList, getCurrentServer } from '../state/module-servers';
import ScrollBox from '../sprites/ScrollBox';
import DataTable from '../sprites/DataTable';
import DataTableRow from '../sprites/DataTableRow';
import DataTableCell from '../sprites/DataTableCell';
import Label from '../sprites/Label';

import type { Connector } from 'react-redux';
import type { ServerList } from '../state/module-servers';
import type { State } from '../types/game';
// import type { Servers } from "../../../server/state/module-servers"; // todo

// type State = {
//     // servers: Servers,
// };

type Props = {
    servers: ServerList,
    currentServer: ?string, // current server address
};

const connector: Connector<{}, Props> = connect(
    (state) => ({
        servers: getServerList(state),
        currentServer: getCurrentServer(state),
    }),
    (dispatch: Dispatch) => ({

    })
);

class ServerSelector extends PureComponent<Props, State> {

    onClick = (server) => {
        const selectedServer = this.props.currentServer;
        if(selectedServer !== server.address) {
            // todo can we do this nicer?
            // todo add ?name=usernameFromForm
            window.location.href = server.address;
        }
    };

    render() {
        const selectedServer = this.props.currentServer;
        return (
            <div>
                <Label>Servers</Label>
                <ScrollBox height={8}>
                    <DataTable>
                        {this.props.servers.map(server => (
                            <DataTableRow
                                isSelected={selectedServer === server.address}
                                onClick={() => this.onClick(server)}
                            >
                                <DataTableCell main>
                                    {server.name}
                                    {server.isTrusted ? '(trusted)': ''}
                                </DataTableCell>
                                <DataTableCell>
                                    {server.address}
                                </DataTableCell>
                                <DataTableCell right>
                                    {server.numPlayers}/{server.maxPlayers}
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTable>
                </ScrollBox>
            </div>
        );
    }

}

export default connector(ServerSelector);
