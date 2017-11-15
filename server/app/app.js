import express from 'express';
import path from 'path';
import setupMessages from '../network-messages/setup-messages';

// create the express app and socket io server, export them so we can use them in bin/www
const app = express();
export default app;

// attach network messaging to our express app
setupMessages(app);

// serve static assets from ./public
app.use(express.static(path.join(__dirname, '../public')));
