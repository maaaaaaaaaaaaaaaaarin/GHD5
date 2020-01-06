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

        let data = request.body;

        // // On suppose que les fields sont exposés directement:

        // let exampledata = {
        //     "date":new Date(),
        //     "commence_termine":0,
        //     "groupe":"S3D"
        // }


        // let cfp : any = checkFieldPresence(data);

        // if (cfp.length==0) return;

        switch (data.question) {
            case "premier-cours":

                let edt: any = EDTs.get(data.groupe);
                let date: Date = new Date();
                if (data["date-time"] != "" && data["date-time"] != null) {
                    console.log("hi")
                    date = new Date(data["date-time"]);
                }

                date.setHours(6);
                date.setMinutes(0);

                let coursSuivant = edt.getCoursSuivant(date);
                response.send(JSON.stringify(coursSuivant));
                break;

            default:
                break;
        }


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

    });

    app.listen(port, () => {
        console.log(`
            
            Listening on port ${port} ...

        `);
    })
})();