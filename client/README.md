# Nodewarx client

## Decoupling

Each of these should be replacable without touching other layers:

1. network layer (now socket.io, possibly pure websockets)
2. state layer (redux + redux-observable, possibly mobx or redux + sagas)
3. view layer (pure react, no knowledge of the DOM, etc.)
4. render layer (react-dom + styled components, possibly react-canvas or other)
