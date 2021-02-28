const env = require('../env.json') 
const jwt = require('jsonwebtoken')

/**
 * read token from local storage
 */
let _token = null;
if (localStorage.getItem('REACT_TOKEN_AUTH')){
    _token = JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH'))
}

/**
 * returns jwt token
 */
export const getToken = async () => {
    return _token;
};

/**
 * returns true if UserId is not -1 as determined by userIdFromToken()
 * otherwise returns false
 */
export const isLoggedIn = () => {
    return userIdFromToken() != -1;
};

/**
 * stores jwt token to local storage
 * @param {string} token 
 */
export const setToken = (token) => {
    if (token) {
        localStorage.setItem('REACT_TOKEN_AUTH', JSON.stringify(token));
    } else {
        localStorage.removeItem('REACT_TOKEN_AUTH');
    }
    _token = token;
};

/**
 * returns userId which is stored in token
 * return -1 if no token is set or one is set but expired
 */
export const userIdFromToken = () => {
    try{
        if(!_token) throw new Error("No token");

        const decodedToken = jwt.verify(_token, env.jwtKey);

        return decodedToken.userId;
        
    }catch(err){
        return -1;
    }
}
    

const createTokenProvider = {
    getToken,
    isLoggedIn,
    userIdFromToken,
    setToken
};

export default createTokenProvider
