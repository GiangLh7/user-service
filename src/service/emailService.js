const utils = require('gile-utils');
const conf= require('../conf/settings');
const encodingSecret = conf.get('customTokenConfig:tokenSecret');
const encodingTokenExpiration = conf.get('customTokenConfig:tokenExpiration');
const TokenIssuer = new utils.TokenIssuer(conf.get('hapi:auth:tokenSecret'));

/**
 * Issue new activation email string for a user
 */
exports.issueEmailActivationToken = (user, isChangingEmail) => {
    const data = {
        userId: user.id,
        email: isChangingEmail ? user.newEmail : user.email
    };
    return TokenIssuer.generateToken(data, encodingSecret, encodingTokenExpiration);
};

/**
 * Logic to verify an encoded activation email string
 * @param activationString
 */
exports.verifyEmail = (activationString) => {

};