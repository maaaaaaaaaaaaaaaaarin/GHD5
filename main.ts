import {
    Groupe,
    EmploisDuTemps
} from ".";

import express, {Application}  from 'express';

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


(main = () : void => {
    

    // Chargement des groupes;

    let Groupes: Groupe[] = [];
    SEMESTRE(3).forEach(g => {
        Groupes.push(new Groupe(g[0], g[1]));
    });

    app.post('/webhook', (request, response) => {

        console.log(request.body);
        response.send("OK");

    });

    app.listen(port, () => {
        console.log(`
            
            Listening on port ${port} ...

        `);
    })
})();