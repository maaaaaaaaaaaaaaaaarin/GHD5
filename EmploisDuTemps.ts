import request = require("request");
import fs      = require("fs");
import {
    Logger,
    icsToJson,
    Groupe,
    Cours
} from ".";

export class EmploisDuTemps {

    private contenu    : Cours[];
    private initdone   : boolean = false;
    static  forceUpdate: boolean = false;
    static  baseURI    : string  =
    "https://edt.iut-tlse3.fr/planning/info/";
    static fext: Object          = {
        "json": ".json",
        "ics" : ".ics"
    }

    constructor(groupe: Groupe, callback?: Function) {
        
        let codes: Object    = Groupe.getCodes();
        let année: string    = groupe.getAnnée().toString();
        let lettre: string   = groupe.getGroupe();
        let filename: string = `${codes[année][lettre]}`;
        let jsonfile: string = `${filename}${EmploisDuTemps.fext["json"]}`;
        let icsfile: string  = `${filename}${EmploisDuTemps.fext["ics"]}`;

        // Si le fichier JSON n'existe pas, ou si une màj est forcée;
        if (!fs.existsSync(jsonfile) || EmploisDuTemps.forceUpdate) {
            Logger.info(`Le fichier ${jsonfile} n'existe pas, création. (groupe: ${groupe})`);
            // The More You Know: URI signifie Uniform Resource Identifier;
            let targetURI: string = `${EmploisDuTemps.baseURI}${icsfile}`;
            request.get(targetURI, (err, res, body) => {
                // Traitement de l'erreur par Logger
                if (err) Logger.error(err);

                let converted: icsToJson = new icsToJson(res.body);
                console.log(converted.getJSON());
                let jsonStr: string  = JSON.stringify(converted.getJSON());
                console.log(jsonStr)
                fs.writeFileSync(__dirname + '/' + jsonfile, jsonStr);
            });
        }
        if (fs.existsSync(jsonfile)) {
            fs.readFile(jsonfile, (err, data) => {
                
                // Traitement de l'erreur par Logger
                if (err) Logger.error(err); 

                this.contenu  = JSON.parse(data.toString());
                this.initdone = true;
                
                Logger.info(`EDT du Groupe S${année}${lettre} chargé.`);

                if (callback) callback();
            })
        }
    }
    
    static setForceUpdate(bool: boolean): void {
        this.forceUpdate = bool;
    }
    
    static getBaseURI(): string {
        return this.baseURI;
    }

    private getCoursSharedLogic(date: Date, operator: string): void {
        // Si l'opérateur est -, l'heure ciblée est 18:30, autrement, 8:00
        let [h,m]: number[] = operator=='-'?[18,30]:[8,0];
        date.setHours(eval(`date.getHours()${operator}1`));
        date.setMinutes(eval(`date.getMinutes()${operator}30`));
        if (Number(`${date.getHours()}${date.getMinutes()}`) >= Number([h,m].toString())) {
            date.setDate(eval(`date.getDate()${operator}1`));
            date.setHours(h);
            date.setMinutes(m);
        }
    }

    public getContenu(): Cours[] {
        return this.contenu;
    }

    public getCoursAt(date: Date): Cours {
        let aTargetDate: Number[] = [
            date.getFullYear(),
            (date.getMonth()%13)+1,     // d.getMonth() --> mois sous forme d'indice (JAN = 0)
            date.getDate()
        ]

        let aTargetTime = [
            date.getHours(),
            date.getMinutes()
        ];

        let sTargetDate: string = aTargetDate.toString();
        let coursAt: Cours      = null;

        //console.log(this.getContenu());

        this.getContenu().forEach(cours => {
            let conditions_etre_dans_cours: boolean[] = [
                (aTargetTime[0] == cours.start[1][0] && aTargetTime[1] >= cours.start[1][1]),
                (aTargetTime[0] == cours.end[1][0]   && aTargetTime[1] <  cours.end[1][1]),
                (aTargetTime[0] >  cours.start[1][0] && aTargetTime[0] <  cours.end[1][0])
            ];
            if (conditions_etre_dans_cours.some(x=>x)) {
                coursAt = cours;
            }
        })
        return coursAt;
    }

    public getCoursSuivant(date: Date = new Date()): Cours {
        
        let cours: Cours = this.getCoursAt(date);

        do {
            this.getCoursSharedLogic(date, '+');
            /*date.setHours(date.getHours()+1);
            date.setMinutes(date.getMinutes()+30);
            let fTime: string = `${date.getHours()}${date.getMinutes()}`;
            if (Number(fTime) >= 1830) {
                date.setDate(date.getDate()+1);
                date.setHours(8);
                date.setMinutes(0);
            }*/
        } while(!cours); // Tant que la valeur renvoyée est `null`;

        return cours;
    }

    public getCoursPrécédent(date: Date = new Date()): Cours {

        let cours: Cours = this.getCoursAt(date);

        do {
            this.getCoursSharedLogic(date, '-');
        } while(!cours); // Tant que la valeur renvoyée est `null`;

        return cours;
    }

}