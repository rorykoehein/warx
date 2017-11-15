# Nodewarx client

## Decoupling

Each of these should be replacable with out touching other layers:

1. network layer (now socket.io, possibly websockets)
2. state layer (redux + redux-observable, possibly mobx or redux + sagas)
3. view layer (pure react, ideally no knowledge of the DOM, etc.)
4. style layer (react-dom + styled components, possibly react-canvas or other)
