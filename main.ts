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
    "lundi","mardi","mercredi",
    "jeudi","vendredi","samedi",
    "dimanche"
]

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

const returnMessage = {
    "fulfillmentText":"response",
    "fulfillmentMessages":[
        {
            "text": {
                "text": [
                    "lol :)"
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


let cas = [

    // FORMAT:
    //  [ 0, 1 ]
    //  0 --> Elements nécessaires au déclenchement 
    //  1 --> Groupe de déclenchement

    // prochain() / preced(), a partir de demain
    // Heure de début / fin d'une journée donnée
    [{"commence_termine":true, "date":true, "groupe":true}, "commence_termine"],
    
    // prochain, a partir de date maintenant
    // Prochain cours
    [{"groupe":true, "prochain":true}, "prochain_cours"],

    // prochain, a partir de date maintenant, check si cours = cours demandé
    // Prochain cours d'une matière donnée
    // -- SI: cours == null
    //    ALORS chercher prochain créneau libre
    [{"groupe":true, "prochain":true, "matière":true}, "prochain_cours"],

    // Prochain cours avec professeur donné
    [{"professeur":true, "groupe":true, "prochain":true}, "prochain_cours"],

    // Prochain cours avec professeur donné dans une salle donnée
    [{"professeur":true, "groupe":true, "prochain":true, "salle":true}, "prochain_cours"],


    // Cas de test
    [{"hello":true,"world":true}, "test"],

    // Mettre à jour les emplois du temps manuellement
    [{"màj":true, "mdp":true}, "mise_a_jour"]
];


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

    function format(inobj: any): string {
        let out: string = "";
        Object.keys(inobj).forEach(e => {
            out+=e+":"+inobj[e]+"\n";
        })
        return out;
    }

    function checkFieldPresence(jsonobj: any): Array<Object> {

        for (let element in jsonobj) {
            jsonobj[element] = true;
        }

        let fjobj = format(jsonobj);

        let target_action = cas.map(c => {
            let f = format(c[0]);
            return {"object":c, "present":fjobj==f, "formatted":f}; 
        })
        target_action = target_action.filter(c => {
            return c.present;
        })

        return target_action;
    }

    app.post('/webhook', (request, response) => {

        if (!request==undefined) response.send("Invalid Request");

        let data = request.body.queryResult.parameters;

        console.log(request.body)

        switch (data.question) {
            case "premier-cours":
                let edt: any = EDTs.get(data.groupe);
                let date: Date = new Date();
                if (data["date-time"] != "" && data["date-time"] != null) {
                    date = new Date(data["date-time"]);
                }

                date.setHours(6);
                date.setMinutes(0);

                let coursSuivant = edt.getCoursSuivant(date);
                let returnString: string = "";
                returnString += `Vous commencez à ${coursSuivant.start[1][0]}h${coursSuivant.start[1][1]} ${jours[date.getDay()-1]}`;
                returnMessage.fulfillmentMessages[0].text.text[0] = returnString;
                response.send(JSON.stringify(returnMessage));
                //response.send(JSON.stringify(coursSuivant));
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