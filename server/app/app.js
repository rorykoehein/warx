import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import setupMessages from '../network-messages/setup-messages';

// create the express app and socket io server, export them so we can use them in bin/www
const app = express();
export default app;

// attach network messaging to our express app
app.use(bodyParser.json());
setupMessages(app);

// serve static assets from ./public
app.use(express.static(path.join(__dirname, '../../public')));
