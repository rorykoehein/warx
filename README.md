# Nodewarx

## Architecture

Each of these should be replacable with out touching other layers (much). Ideally layer should only touch the one below:

1. client (see client architecture in client/README.md)
2. www (http server)
3. app (express)
4. network messages (send and get messages, now socket.io, possibly plain websockets)
5. game state (redux + redux-observable, possibly mobx or redux + sagas)
6. possibly: data sources

## Modules in state
The state folder is where the business logic lives. This is the largest layer and
is split up in several modules. Each module can export initial state, actions,
reducers, selectors and epics. These modules can be generated by using `plop module`.

## Network messages
This application shares redux actions between server and client, actions can be
marked as any of these:

- client-to-client actions (i.e. opening a panel)
- client-to-server actions (i.e. connect request, move request)
- server-to-client actions (i.e. new connection, player moved)
- server-to-server actions: update server state without directly sending to client(s)

Actions which are client-to-server or server-to-client will also be dispatched
at its origin. This means actions *must* be unique between client and server.
This should be tested somehow, possibly at runtime (todo).

### Option 1 (used now): set this type on the action
- pro: the type is defined where the action is defined
- con: the types of actions are scattered across modules, it's not easy to see
which actions will be sent to the client in one spot

### Option 2: keep a list of these types in a single file
- pro: it's easy to see which client-actions will be sent to the server and which
server actions will be sent to the client in one spot
- con: needs a separate list of

### Option 3: ditch shared actions, for special messages
- pro: separate client and server actions
- con: extra translation between messages and actions needed

## Deployments

### Heroku
1. initialize heroku in the dist folder

```
$ cd my-project/
$ git init
$ heroku git:remote -a {my-heroku-project}
```

2. run `./build.sh` and then `./heroku.sh` from the root project folder

### Now.sh
Run `now` from the dist folder