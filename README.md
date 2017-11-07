# Nodewarx

## Architecture

Each of these should be replacable with out touching other layers (much). Ideally layer should only touch the one below:

1. client (see client architecture in client/README.md)
2. www (http server)
3. app (express)
4. network messages (send and get messages, now socket.io, possibly plain websockets)
5. messages-actions (network-state-glue: translates network messages to redux actions vice versa)
6. game state (redux + redux-observable, possibly mobx or redux + sagas)
7. possibly: data sources

## Redux Actions
- client-to-client actions (i.e. opening a panel)
- client-to-server actions (i.e. connect-request, move request)
- server-to-client actions (i.e. new connection, player moved)
- server-to-server actions ?