module.exports = {
    notFound: {
        code: 404,
        message: 'User was not found'
    },
    badRequest: {
        code: 400,
        message: 'User data was invalid!'
    },
    emailActivationTokenInvalid: {
        code: 400,
        message: 'Token for activating the email was not valid!'
    },
    emailActivationTokenExpired: {
        code: 400,
        message: 'Token for activating the email is expired!'
    },
    unauthorized: {
        code: 401,
        message: 'Unauthorized access to the resource!'
    },
    serverError: { code: 500, message: 'Connection error!' }
}