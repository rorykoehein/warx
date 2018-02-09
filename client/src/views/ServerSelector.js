// @flow

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { getServerList } from '../state/module-servers';
import ScrollBox from '../sprites/ScrollBox';
import DataTable from '../sprites/DataTable';
import DataTableRow from '../sprites/DataTableRow';
import DataTableCell from '../sprites/DataTableCell';

import type { Connector } from 'react-redux';
import type { ServerList } from '../state/module-servers';
import type { State } from '../types/game';
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

    // todo move
    state = {
        selectedServer: null,
    };

    render() {
        return (
            <ScrollBox height={8}>
                <DataTable>
                    {this.props.servers.map(server => (
                        <DataTableRow
                            isSelected={this.state.selectedServer === server.name}
                            onClick={() => this.setState({ selectedServer: server.name })}
                        >
                            <DataTableCell main>
                                {server.name}
                                {server.isTrusted ? '(trusted)': ''}
                            </DataTableCell>
                            <DataTableCell>
                                {server.address}
                            </DataTableCell>
                            <DataTableCell right>
                                {server.players}/{server.maxPlayers}
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTable>
            </ScrollBox>
        );
    }

}

export default connector(ServerSelector);
