import {
    Groupe,
    EmploisDuTemps
} from ".";

import express, {Application}  from 'express';
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
    {"commence_termine":true, "date":true, "groupe":true}
];


(main = () : void => {
    

    // Chargement des groupes;

    let Groupes: Groupe[] = [];
    SEMESTRE(3).forEach(g => {
        Groupes.push(new Groupe(g[0], g[1]));
    });

    function format(inobj: Object): string {
        let out: string = "";
        Object.keys(str).forEach(e => {
            out+=e+":"+str[e];
        })
        return out;
    }

    app.post('/webhook', (request, response) => {

        if (!request==undefined) response.send("Invalid Request");

        let data: any = JSON.parse(request.body);

        // On suppose que les fields sont exposés directement:

        let exampledata = {
            "date":new Date(),
            "commence_termine":0,
            "groupe":"S3D"
        }

        let presence = {};
        Object.keys(data).forEach(field => {
            presence[field] = data[field]==null?false:true;
        })

        cas.forEach(c => {
            if (format(c) == format(presence)) {

            }
        })
        



        console.log(request.body);
        response.send("OK");

    });

    app.listen(port, () => {
        console.log(`
            
            Listening on port ${port} ...

        `);
    })
})();