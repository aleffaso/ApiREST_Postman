const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const auth = require("./auth");

dotenv.config({path: './.env'});

const JWTSecret = process.env.JWT_SECRET

app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



var DB = {
    games: [

        {
            id: 23,
            title: "God of War",
            year: 2010,
            price: 100
        },
        {
            id: 65,
            title: "Spiderman",
            year: 2015,
            price: 90
        },
        {
            id: 1,
            title: "Minecraft",
            year: 2009,
            price: 80
        }
    ],

    users: [
        {
            id: 1,
            name: "Aleff",
            email: "aleffaso@me.com",
            password: "test123" 
        },
        {
            id: 10,
            name: "Antonio",
            email: "antonio@me.com",
            password: "test123" 
        }
    ]
}

app.get("/games", auth, (req,res) => {
    res.statusCode = 200;
    res.json({user: req.loggedUser, games: DB.games});
});

app.get("/game/:id", auth, (req,res) => {
    
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id);
        var game = DB.games.find(game => game.id == id);

        if(game != undefined){
            res.statusCode = 200;
            res.json(game);
        }else{
            res.sendStatus(404);
        }
    }
});

app.post("/game", auth, (req,res) => {
    
    var {title, price, year} = req.body;

    if(isNaN(price) || isNaN(year)){
        res.sendStatus(400);
    }

    DB.games.push({
        id: 23,
        title, 
        price, 
        year
    });

    res.sendStatus(200);

});

app.delete("/game/:id", auth, (req, res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id);
        var index= DB.games.findIndex(game => game.id == id);

        if(index == -1){
            res.sendStatus(404);
        }else{
            DB.games.splice(index,1);
            res.sendStatus(200);
        }
    }
});

app.put("/game/:id", auth, (req,res) => {
    
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    }else{
        var id = parseInt(req.params.id);
        var game = DB.games.find(game => game.id == id);

        if(game != undefined){
            
            var {title, price, year} = req.body;

            if(title!= undefined){
                game.title = title;
            }

            if(price!= undefined){
                game.price = price;
            }

            if(year!= undefined){
                game.year = year;
            }

            res.sendStatus(200);


        }else{
            res.sendStatus(404);
        }
    }
});

app.post("/auth", auth, (req,res) => {

    var {email, password} =  req.body;

    if(email != undefined ){
        
        var user = DB.users.find(user => user.email == email);

        if(user != undefined){

            if(user.password == password){

                jwt.sign({id:user.id, email:user.email}, JWTSecret, {expiresIn: '1h'}, (err, token) => {//Payload
                    if(err){
                        res.status(400);
                        res.json({err:"Failed"});
                    }else{
                        res.status(200);
                        res.json({token: token});
                    }
                }); 

            }else{
                res.status(401);
                res.json({err: "Password does not match"});
            }

        }else{
            res.status(404);
            res.json({err: "The email adress does not exist"});
        }

    }else{
        res.status(400);
        res.json({err: "The email address is not valid"});
    }


});

app.listen(3000,() => {
    console.log("API running");
});