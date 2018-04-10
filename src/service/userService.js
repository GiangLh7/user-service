const userModel = require('../model/user.model');
const errors = require('./error');
const validator = require('validator');
const uuid = require('node-uuid');
const passwordHash = require('password-hash');
const userAuthService = require('./userAuth.service');

/**
* Return specific user data
* @param userId
* @returns {Promise}
*/
exports.get = (userId) => {
  return new Promise((resolve, reject) => {
    userModel.findOne({ id: userId }, (err, user) => {
     if (err || !user) {
       return reject(errors.notFound);
     }
     delete user.password;
     resolve(user);
    });
  });
};

/**
* Return all user data
* @returns {Promise}
*/
exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    userModel.find({}, (err, users) => {
      if (err) {
        return reject({ code: 500, message: err.message });
      }
      let userMap = {};
      users.forEach((user) => {
        userMap[user.id] = user;
      });

      resolve(userMap);
    });
  });
};

function validatePassword(password) {
  // at least 6 characters long
  // One character
  // One number or one special character (not number and not character)
  const customValidator = Object.assign({}, validator, {
    isPassword: (str) => {
      const resutl = str.length > 5
        && /[A-Za-z]+/.test(str)
        && (/[0-9]+/.test(str) || /[^0-9A-Za-z]+/.test(str));
      return resutl;
    }
  });
  return customValidator.isPassword(password);
}

/**
* Validate user data to add
* @param userData
* @param callback
* @returns {*}
*/
exports.validateUserData = (userData, callback) => {
  if (!validator.isEmail(userData.email)) {
    return callback({field: 'email'});
  }

  if (!validatePassword(userData.password)) {
    return callback({ field: 'password' });
  }

  if (!userData.terms) {
    return callback({ field: 'terms' });
  }

  // Check if email is unique
  userModel.find({email: userData.email}, (err, response) => {
    if (err || !response) {
      return callback(errors.serverError);
    }
    if (response.length > 0) {
      return callback({ code: 409, message: 'User with this email exists' });
    }
    callback();
  });
};

/**
* Add a new user
* @param request
* @param callback
*/
exports.addUser = (request, callback) => {
  const userData = request.payload;
  
  userData.id = uuid.v4();
  const plainPassword = userData.password;
  userData.password = passwordHash.generate(userData.password);
  
  const newUser = new userModel(userData);
  newUser.save((err) => {
    if (err) {
        return callback(err);
    }
    userAuthService.authenticate(userData.email, plainPassword, {}, (token) => {
        if (!token) {
            return callback({ code: 403 });
        }
        return callback(null, { token: token.token });
    });
  });
};