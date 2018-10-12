const WebSocketServer = require('ws').Server
const express = require('express')

const wss = new WebSocketServer({port: 40510})

const sockets = [];

wss.on('connection', function (ws) {
    sockets.push(ws);
});


const cards = {
    suggestion:{
        id: 1,
        date_time: 1539253304,
        payload: {
            intent: "top-funds-by-sector",
            title: "Top Funds in Energy Sector",
            tags: ["Energy"],
            type: "suggestion",
            response: [
                {
                    "title": "Energy-Focused Private Equity Strategy",
                    "url": "https://www.morganstanley.com/im/en-us/financial-advisor/strategies/private-credit-and-equity/energy-focused-private-equity.html"
                },
                {
                    "title": "Fidelity energy fund",
                    "url": "https://msim.com"
                },
                {
                    "title": "HSBC energy fund",
                    "url": "https://msim.com"
                }
            ]
        }
    },
    action:{
        id: 2,
        date_time: 1539257435,
        payload: {
            intent: "book-meeting",
            title: "Outlook Confirmation",
            tags: ["Meeting"],
            type: "action",
            response: [
                {
                    "title": "Meeting booked with Sandeep for Thursday Oct 25 at 10 am.",
                    "details":"Confirm?",
                    "url": "https://msim.com"
                }
            ]
        }
    }
}


const app = express();
const port = 3001;

var bodyParser = require("body-parser");
//app.use(express.static,'./');
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.get('/example', (req, res) => res.send('Hello World!'))
app.get('/index.html', (req, res) => res.sendFile(__dirname+'/index.html'));
app.post('/handle', function(req,res){
console.log(req.body);
    var intentName=req.body.intentName;
    var parameters = req.body.parameters;
    var intentType=req.body.intentType;

    const response = cards[intentType];
    console.log(response);
    if(response === null || typeof response === "undefined") {
        res.sendStatus(200);
        return;
    }
    sockets.forEach((sock) => {
        if (sock.readyState === sock.OPEN) {
            sock.send(JSON.stringify(response));
         } 
    })
    res.sendStatus(200);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`))