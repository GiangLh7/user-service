import nconf from 'nconf';

nconf.argv().env();
const envConf = nconf.get('NODE_ENV');
if (envConf && envConf !== 'development') {
    nconf.file('override', `src/conf/${envConf}.json`);
}

nconf.file('default', 'src/conf/development.json');

export default nconf;