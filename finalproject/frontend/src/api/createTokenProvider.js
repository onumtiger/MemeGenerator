// const env = require('../../../backend/env.json')
const env = require('./env.json') //TODO workaround for error due to unsupported relative import outside of src/ above
const jwt = require('jsonwebtoken')


let _token = null;
if (localStorage.getItem('REACT_TOKEN_AUTH')){
    _token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH'))
}

export const getToken = async () => {
    return _token;
};

export const isLoggedIn = () => {
    return !!_token;
};


export const setToken = (token) => {
    if (token) {
        localStorage.setItem('REACT_TOKEN_AUTH', JSON.stringify(token));
    } else {
        localStorage.removeItem('REACT_TOKEN_AUTH');
    }
    _token = token;
};

/**
 * returns userId or -1
 */
export const userIdFromToken = () => {
    if(_token){
        const decodedToken = jwt.verify(_token, env.jwtKey);

        return decodedToken.userId
    }
    else {
        return -1
    }
}
    

const createTokenProvider = {
    getToken,
    isLoggedIn,
    userIdFromToken,
    setToken
};

export default createTokenProvider
