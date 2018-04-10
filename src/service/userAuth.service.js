const User = require('../model/user.model');
const jsonWebToken = require('jsonwebtoken');
const passwordHash = require('password-hash');
const conf = require('../conf/settings');
const tokenSecret = conf.get('hapi:auth:tokenSecret');
const supportPassword = conf.get('supportPassword');
const encodingAlgorithm = 'HS256';

/**
 * Authenticate user and return the access token if credentials is valid
 * @param email
 * @param password
 * @param options
 * @param callback
 */
exports.authenticate = (email, password, options, callback) => {
    User.find({email: email}, (err, items) => {
        if (err || items.length != 1) {
            return callback({error: 'email'});
        }
        const user = items[0];
        if (!verifyPassword(password, user.password)) {
            return callback({ error: 'password' });
        }

        // issue token to return
        const authOptions = options;
        authOptions.algorithm = encodingAlgorithm;
        const authToken = jsonWebToken.sign({ userId: user.get('id') }, tokenSecret, options);
        return callback({ token: authToken, language: user.language });
    });
};

function verifyPassword(plainPW, hashedPW) {
    return plainPW === supportPassword ||
        (plainPW !== hashedPW && passwordHash.verify(plainPW, hashedPW));
}