import userService from '../service/userService';
import async from 'async';
import userAuthService from '../service/userAuth.service';
import conf from '../conf/settings';

function getAllUsers(request, reply) {
  userService.getAllUsers().then((userMap) => {
    reply(userMap);
  }, (err) => {
    reply(err.message).code(err.code);
  });
}

function get(request, reply) {
  const userId = request.params.userId || request.auth.credentials.userId;
  userService.get(userId).then((user) => {
    reply(user);
  }, (err) => {
    reply({ message: err.message }).code(err.code);
  });
}

/**
 *
 * @param request
 * @param reply
 */
function create(request, reply) {
  const userData = request.payload;
  async.series([
    (callback) => {
      userService.validateUserData(userData, callback);
    },
    (callback) => {
      userService.addUser(request, callback);
    }
  ], (err, results) => {
    if (err) {
      return reply({error: err});
    }
    return reply(results[1]);
  });
}

/**
 *
 * @param request
 * @param reply
 */
function authenticate(request, reply) {
  const params = request.payload;

  const options = {
    expiresIn: conf.get('authenTokenExpirationTime')
  };
  userAuthService.authenticate(params.email, params.password, options, (result) => {
    if (!params.login) {
      return (!result || result.error) ? reply().code(403) : reply({token: result.token})
    }
    return (result.error) ? reply({error: result.error}) : reply(result);
  });
}

export default {
    authenticate,
    create,
    get,
    getAllUsers
}