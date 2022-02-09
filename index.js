const express = require("express");
const app = express();
const bodyParser = require("body-parser");

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
    ]
}

app.get("/games", (req,res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

app.get("/game/:id", (req,res) => {
    
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

app.post("/game", (req,res) => {
    
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

app.listen(3000,() => {
    console.log("API running");
});