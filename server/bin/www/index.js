import http from 'http';
import app, { io } from '../../app';

const port = process.env.PORT || 5000;
const server = http.createServer(app);
io.attach( server );
server.listen(port);