import {
    Groupe,
    EmploisDuTemps
} from ".";

import express, {Application, json}  from 'express';
import { format } from "path";
import fs from 'fs';
import http from 'http';
import https from 'https';

const app : Application = express();
let   main: Function;
let   http_port: number = 80;
let   https_port: number = 443;

const privateKey = fs.readFileSync('/etc/letsencrypt/live/ghcc.xyz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/ghcc.xyz/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/ghcc.xyz/chain.pem', 'utf8');

const credentials = {
        key: privateKey,
        cert: certificate,
        ca: ca
};

const jours = [
    "Lundi","Mardi","Mercredi",
    "Jeudi","Vendredi","Samedi",
    "Dimanche"
]

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const returnMessage = {
    "fulfillmentText":"response",
    "fulfillmentMessages":[
        {
            "text": {
                "text": [
                    "La demande n'a pas pu être traitée"
                ]
            }
        }
    ],
    "source":""
}


app.use(express.json());

// Certification let's encrypt
app.get('/.well-known/acme-challenge/*', express.static(__dirname + '/.well-known/acme-challenge/a-string'));

app.get('/', (req, res) => { 
        res.charset = 'utf-8';
        res.send("WELCOME TO UGANDA<br/>Page demandée: "+req.url);
})

app.get('/test', (req,res) => {
        res.charset = 'utf-8';
        res.send("Who killed Captain Alex???");
})

const SEMESTRE = function(semestre: number): any[][] {
    let out: any[][] = [];
    "ABCDE".split('').forEach(s => {
        out.push([semestre, s])
    });
    return out;
};


(main = () : void => {
    

    // Chargement des groupes;

    let Groupes: Groupe[] = [];
    let EDTs: Map<String, EmploisDuTemps> = new Map();

    SEMESTRE(3).forEach(g => {
        Groupes.push(new Groupe(g[0], g[1]));
    });

    Groupes.forEach(groupe => {
        EDTs.set(groupe.toString(), new EmploisDuTemps(groupe));
    });

    function setReturn(str: string) {
        returnMessage.fulfillmentMessages[0].text.text[0] = str;
    }

    function appendReturn(str: string) {
        returnMessage.fulfillmentMessages[0].text.text[0] += str;
    }

    app.post('/webhook', (request, response) => {

        if (!request==undefined) response.send("Invalid Request");

        let data = request.body.queryResult.parameters;

        let edt: any             = "";
        let date: Date           = new Date();
        let datestr: string = "";
        let heurestr: string = `à ${date.getHours()}h${date.getMinutes()==0?'':date.getMinutes()}`;
        let returnString: string = "";

        if (data.groupe) {
            edt  = EDTs.get(data.groupe);
            datestr = "aujourd'hui"
        }
            
        if (data["date-time"] != "" && data["date-time"] != null) {
            date = new Date(data["date-time"]);
            datestr = `le ${jours[date.getDay()-1]} ${date.getDate()}`;
            heurestr = `à ${date.getHours()}h${date.getMinutes()==0?'':date.getMinutes()}`;
        }
        if (data["date-time"]["date-time"]) {
            date = new Date(data["date-time"]["date-time"]);
            datestr = `le ${jours[date.getDay()-1]} ${date.getDate()}`;
            heurestr = `à ${date.getHours()}h${date.getMinutes()==0?'':date.getMinutes()}`;
        }
        switch (data.question) {
            
            case "premier-cours":
                date.setHours(6);
                date.setMinutes(0);

                let coursSuivant = edt.getCoursSuivant(date);
                returnString = `Vous commencez à ${coursSuivant.start[1][0]}h${coursSuivant.start[1][1]==0?'':coursSuivant.start[1][1]} ` + datestr;
                
                setReturn(returnString);
                response.send(JSON.stringify(returnMessage));
                break;
            
            case "fin-cours":
                date.setHours(19);
                date.setMinutes(0);

                let coursPrecedent = edt.getCoursPrécédent(date);
                returnString = `Vous terminez à ${coursPrecedent.end[1][0]}h${coursPrecedent.end[1][1]==0?'':coursPrecedent.end[1][1]} ` + datestr;

                setReturn(returnString);
                response.send(JSON.stringify(returnMessage));
                break;

            case "salle":
            case "cours":
                let coursActuel = edt.getCoursAt(date);
                console.log(coursActuel)
                returnString = `Vous n'avez pas cours ${datestr} ${heurestr}`;
                if (Object.keys(coursActuel).length > 0) {
                    returnString = `Vous avez ${coursActuel.type} de ${coursActuel.matière} en salle ${coursActuel.salle} ${datestr} ${heurestr}`;
                }
                setReturn(returnString);
                response.send(JSON.stringify(returnMessage));
                break;

            //est-ce que j'ai un trou demain etc
            case "trou":
                break;
            
            case "prochain-cours":
                break;
            case "prochain-matiere":
                break;
            case "prochain-exam":
                 break;
            case "prochain-salle":
                break;
            case "prochain-trou":
                break;
            case "prochain-prof":
                break;
            case "prochain-type":
                break;

            default:
                break;
        }

        
    });

    httpServer.listen(http_port, () => {
        console.log(`
        HTTP: Listening on poart ${http_port}
        `);
    });
    httpsServer.listen(https_port, () => {
        console.log(`
        HTTP: Listening on poart ${https_port}
        `);
    });
})();