import userCtrl from './controllers/userCtrl';
import emailCtrl from './controllers/emailCtrl';
import Joi from 'joi';
import authorizationService from './service/authorization';

export default [
    {
        method: 'GET',
        path: '/get-all-users',
        handler: userCtrl.getAllUsers,

    },
    {
        method: 'GET',
        path: '/{userId?}',
        handler: userCtrl.get,
        config: {
            auth: 'token',
            validate: {
                params: {
                    userId: Joi.string()
                }
            },
            plugins: {
                authorization: {
                    validate: authorizationService.userAuthorize
                }
            }
        }
    },
    {
        method: "POST",
        path: '/',
        handler: userCtrl.create,
        config: {
            validate: {
                payload: {
                    email: Joi.string().email().lowercase().required(),
                    password: Joi.string().min(6).required(),
                    firstName: Joi.string().required(),
                    lastName: Joi.string().required(),
                    terms: Joi.boolean().valid(true).required()
                }
            }
        }
    },
    {
        method: "POST",
        path: "/auth",
        handler: userCtrl.authenticate,
        config: {
            validate: {
                payload: {
                    email:  Joi.string().email().lowercase().required(),
                    password: Joi.string().required(),
                    remember_me: Joi.boolean(),
                    login: Joi.boolean()
                }
            }
        }
    },
    {
        method: "GET",
        path: "/email-token",
        handler: emailCtrl.issueEmailToken,
        config: {
            auth: "token"
        }
    },
    {
        method: "POST",
        path: "/verify-email",
        handler: emailCtrl.verifyEmail,
        config: {
            validate: {
                payload: {
                    activationString: Joi.string().required()
                }
            }
        }
    }
];