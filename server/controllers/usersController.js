const User = require('../models/User');
const auth = require('../auth');
const { body } = require('express-validator');

const bcrypt = require('bcryptjs');

// Login
const userLogin = async (req, res) => {
    const { email, mdp } = req.body;
    const authetication = auth.authenticate(email, mdp)
    .then((resolved) => {
        //console.log(resolved);
        const accessToken = auth.createTokens(email, mdp);
        res.cookie('access_token', accessToken);
        res.redirect('/users');
    })
    .catch((rejected) => {
        //console.log(rejected);
        res.render('login');
  })
};

// retrieve and return all users
const userListing = (req, res) => {
    User.find()
        .then(user => {
            res.render(`users`, { users: user});
        })
        .catch(err => {
            res.status(500).send({message: err.message || `erreur lors de l'obtention des données`})
        })
};

// Not in use
const userValidationRules = () => {
    return [
        body('nom').notEmpty(),
        body('prenom').notEmpty(),
        body('email').isEmail(),
        body('mdp').isLength({ min: 6})
    ];
};

// Register
const userRegister = (req, res) => {
    const { nom, prenom, email, mdp, mdp2 } = req.body;

    let errors = [];

    // Vérifier les champs obligatoires
    if(!nom || !prenom || !email  || !mdp || !mdp2) {
        errors.push({ msg: 'Veuillez remplir tous les champs' });
    }

    // Vérifier si les mots de passe sont identiques
    if(mdp !== mdp2) {
        errors.push({ msg: 'Les mots de passe ne sont pas identiques' });
    }

    // Vérifier la taille du mdp
    if(mdp.length < 6) {
        errors.push({ msg: 'Le mot de passe doit contenir au moins 6 caractères' })
    }

    if(errors.length > 0) {
        console.log(errors);
        res.render('register', { errors, nom, prenom, email });
    } else {
        // Les champs sont valides
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // Utilisateur éxiste déjà
                    errors.push({ msg: 'Un utilisateur avec cet email existe déjà' });
                    console.log(errors);
                    res.render('register', { errors, nom, prenom, email });
                } else {
                    const newUser = new User({ nom, prenom, email, mdp });

                    // Hashing du mdp
                    bcrypt.genSalt (10, (err, salt) =>
                        bcrypt.hash(newUser.mdp, salt, (err, hash) => {
                            if(err) throw err;
                            // Hashing du mdp
                            newUser.mdp = hash;
                            // Sauvegarde de l'utilisateur
                            newUser.save()
                                .then(user => {
                                    res.redirect('/login');
                                })
                                .catch(err => console.log(err));
                    }))
                }
            });
    }
};

module.exports = {
    userRegister,
    userListing,
    userLogin,
    userValidationRules
}