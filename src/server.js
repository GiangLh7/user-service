import debug from 'debug';
import app from './app'

app.start(() => {
    debug('Server running at:', app.info.uri);
});