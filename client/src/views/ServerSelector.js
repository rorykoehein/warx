// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getServerList, getCurrentServer, hasServers } from '../state/module-servers';
import ScrollBox from '../sprites/ScrollBox';
import DataTable from '../sprites/DataTable';
import DataTableBody from '../sprites/DataTableBody';
import DataTableRow from '../sprites/DataTableRow';
import DataTableCell from '../sprites/DataTableCell';
import Label from '../sprites/Label';

import type { Connector } from 'react-redux';
import type { ServerList } from '../state/module-servers';
import type { State } from '../types/game';

type Props = {
    servers: ServerList,
    currentServer: ?string, // current server address
    has: ?boolean, // current server address
};

const connector: Connector<{}, Props> = connect(
    (state) => ({
        servers: getServerList(state),
        currentServer: getCurrentServer(state),
        has: hasServers(state),
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
        const { currentServer, servers, has } = this.props;
        return !has ? null : (
            <div>
                <Label>Servers</Label>
                <ScrollBox height={8}>
                    <DataTable>
                        <DataTableBody>
                        {servers.map(server => (
                            <DataTableRow
                                isSelected={currentServer === server.address}
                                onClick={() => this.onClick(server)}
                                key={server.address}
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
                                <DataTableCell right>
                                    {server.numBots} bots
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                        </DataTableBody>
                    </DataTable>
                </ScrollBox>
            </div>
        );
    }

}

export default connector(ServerSelector);
