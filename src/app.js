import mongoose from 'mongoose';
import debug from 'debug';
import {Server} from 'hapi';
import conf from './conf/settings'
import routes from './router';
import {Authorization} from 'gile-utils';
mongoose.Promise = Promise;
const authorizationService = new Authorization(conf.get('hapi:auth:tokenSecret'));
const server = new Server(conf.get('hapi:conf'));

mongoose.connect(conf.get('db:connectionString'), { useMongoClient: true });
mongoose.connection.on('error', () => {
    console.info('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

server.connection({ port: process.env.PORT || 8080, routes: { cors: true }});
server.register(require('hapi-auth-jwt'), (err) => {
    if (err) {
        debug(err);
    }
    server.auth.strategy('token', 'jwt', authorizationService.authStrategy);
    server.route(routes);
});

server.ext('onPreResponse', authorizationService.responeValidation);
server.ext('onPreHandler', authorizationService.requestValidation);

export default server;