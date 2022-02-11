const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config({path: './.env'});

const JWTSecret = process.env.JWT_SECRET

function auth(req, res, next){

    const authToken = req.headers['authorization'];

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        const token = bearer[1];

        jwt.verify(token, JWTSecret, (err, data) => {

            if(err){
                res.status(401);
                res.json({err: "Invalid token"});
            }else{
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }
        });
        
    }else{
        res.status(401);
        res.json({err:"Invalid token"})
    }

};

module.exports = auth