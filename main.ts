import {
    Groupe,
    EmploisDuTemps
} from ".";

import express, {Application, json}  from 'express';
import { format } from "path";

const app : Application = express();
let   main: Function;
let   port: number = 80;

app.use(express.json());


const SEMESTRE = function(semestre: number): any[][] {
    let out: any[][] = [];
    "ABCDE".split('').forEach(s => {
        out.push([semestre, s])
    });
    return out;
};


let cas = [

     // Heure de début / fin d'une journée donnée
    {"commence_termine":true, "date":true, "groupe":true},
    
    // Prochain cours
    {"groupe":true, "prochain":true},

    // Prochain cours d'une matière donnée
    {"groupe":true, "prochain":true, "matière":true},

    // Prochain créneau libre pour groupe donné
    // où matière = null / 0
    {"groupe":true, "prochain":true, "matière":true},

    // Prochain cours avec professeur donné
    {"professeur":true, "groupe":true, "prochain":true},

    // Prochain cours avec professeur donné dans une salle donnée
    {"professeur":true, "groupe":true, "prochain":true, "salle":true},


    // Cas de test
    {"hello":true,"world":true},

    // Mettre à jour les emplois du temps manuellement
    {"màj":true, "mdp":true}
];


(main = () : void => {
    

    // Chargement des groupes;

    let Groupes: Groupe[] = [];
    SEMESTRE(3).forEach(g => {
        Groupes.push(new Groupe(g[0], g[1]));
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
            let f = format(c);
            return {"o":c, "p":fjobj==f, "f":f}; 
        })
        target_action = target_action.filter(c => {
            return c.p;
        })

        return target_action;
    }

    app.post('/webhook', (request, response) => {

        if (!request==undefined) response.send("Invalid Request");

        let data: any = request.body;

        // On suppose que les fields sont exposés directement:

        let exampledata = {
            "date":new Date(),
            "commence_termine":0,
            "groupe":"S3D"
        }


        let cfp = checkFieldPresence(data);
        console.log(cfp);

        // let presence: any = {};
        // Object.keys(data).forEach(field => {
        //     presence[field] = data[field]==null?false:true;
        // })

        // let i: number = 1;
        // cas.forEach(c => {
        //     if (format(c) == format(presence)) {
        //         console.log("request elements match n°"+i);
        //     }
        //     i++;
        // })

        response.send("OK");

    });

    app.listen(port, () => {
        console.log(`
            
            Listening on port ${port} ...

        `);
    })
})();