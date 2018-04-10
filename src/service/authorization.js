const conf = require('../conf/settings');
const superUser = conf.get('apiSettings').accessApiRoles.superUser;

exports.userAuthorize = (payload, userId, params) => {
    return new Promise((resolve) => {
        const userIdFromParams = params ? params.userId : null;
        resolve((superUser === userId && userIdFromParams) ||
            (userIdFromParams === userId) || (!userIdFromParams && superUser !== userId));
    });
};