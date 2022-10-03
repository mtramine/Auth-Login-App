const User = require('./models/User');
const { sign, verify} = require('jsonwebtoken');
const keys = require('./config/keys');
const bcrypt = require('bcryptjs');


const authenticate = (email, mdp) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({ email: email });
        if(user) {
            bcrypt.compare(mdp, user.mdp, (err, isMatch) => {
                if (err) {
                    reject(err);
                } else if (!isMatch) {
                    reject({
                        error: true,
                        message: `Mot de passe incorrecte`
                    });
                } else {
                    resolve({
                        error: false,
                        message: `Authentification réussie`,
                    });
                }
            });
        } else {
            reject({
                error: true,
                message: `L'utilisateur n'éxiste pas`
            });
        }
    });
};

const createTokens = (email, mdp) => {
    const accessToken = sign({ email: email, mdp: mdp }, keys.JWT_SECRET_KEY, { expiresIn: '30s' });

    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies['access_token'];

    if (!accessToken) {
        return console.log('Utilisateur non identifié');
    }
    try {
        const validToken = verify(accessToken, keys.JWT_SECRET_KEY);
        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        console.log('erreur')
    }
};

module.exports = { createTokens, validateToken, authenticate };