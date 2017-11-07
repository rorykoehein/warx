import io from './socket';
import getMessages from './get-messages';
import mapMessagesToActions from '../messages-actions/map-messages-to-actions';

// translate messages from the network to actions
export default app => mapMessagesToActions(getMessages(io, app));
