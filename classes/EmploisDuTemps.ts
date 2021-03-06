import request = require("request");
import fs      = require("fs");
import {
    Logger,
    icsToJson,
    Groupe,
    Cours
} from ".";
import { json } from "express";

export class EmploisDuTemps {

    private contenu    : Cours[] = [];
    static  forceUpdate: boolean = false;
    static  savePath   : string  = "./backups/";
    static  baseURI    : string  =
    "https://edt.iut-tlse3.fr/planning/info/";
    static fext: any = {
        "json": ".json",
        "ics" : ".ics"
    }

    private groupe : Groupe;

    /**
     * Charge, ou télécharge l'emplois du temps correspondant au groupe passé
     * @param groupe Groupe ciblé par l'emplois du temps
     */
    constructor(groupe: Groupe, callback?: Function) {
        this.groupe = groupe;
        this.updateContenu();
    }

    /**
     * Mets à jour la valeur de l'attribut `contenu`
     * Le fichier associé au contenu d'un groupe donné est altéré si:
     * - forceUpdate = true
     * - le fichier n'existe pas au préalable  
     * `callback` reçoit un `string` en paramètre:    
     * - 'maj' si le fichier a été re-téléchargé
     * - 'crt' si le fichier a été crée (init)
     * - 'load' si le fichier a été chargé
     * @param callback<string>
     */
    public updateContenu(callback?:Function): void {
        
        let codes: any       = Groupe.getCodes();
        let année: string    = this.groupe.getAnnée().toString();
        let lettre: string   = this.groupe.getGroupe();
        let filename: string = `${codes[année][lettre]}`;
        let jsonfile: string = `${filename}${EmploisDuTemps.fext["json"]}`;
        let icsfile: string  = `${filename}${EmploisDuTemps.fext["ics"]}`;
        let cbstr: string = "";

        if (!fs.existsSync(jsonfile) || EmploisDuTemps.forceUpdate) {
            if (!fs.existsSync(jsonfile)) Logger.info(`Le fichier ${jsonfile} n'existe pas, création. (groupe: ${this.groupe})`);
            if (EmploisDuTemps.forceUpdate) Logger.info(`Mise à jour fichier groupe ${this.groupe})`);
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
                this.contenu  = converted.getJSON();
            });
            
            if (fs.existsSync(EmploisDuTemps.savePath)) {
                let today = new Date();
                let dirname = EmploisDuTemps.savePath+(today.getDate() + today.getMonth()+1 + today.getFullYear())+'/';
                if (fs.existsSync(dirname)) {
                    fs.rename(__dirname+'/'+jsonfile, dirname+jsonfile, function(err) {
                        console.log('Backed up '+jsonfile+'!');
                    });
                } else {
                    fs.mkdirSync(dirname);
                    fs.rename(__dirname+'/'+jsonfile, dirname+jsonfile, function(err) {
                        console.log('Backed up '+jsonfile+'!');
                    });
                }
            }

            if (EmploisDuTemps.forceUpdate) cbstr="màj";
            if (!fs.existsSync(jsonfile)) cbstr="crt";
        }
        
        if (fs.existsSync(jsonfile)) {
            fs.readFile(jsonfile, (err, data) => {
                
                // Traitement de l'erreur par Logger
                if (err) Logger.error(err); 

                this.contenu  = JSON.parse(data.toString());
                
                Logger.info(`EDT du Groupe S${année}${lettre} chargé.`);
                cbstr="load";
            })
        }
        if (callback) callback(cbstr);
    }

    /**
     * Force une mise à jour du fichier JSON du groupe concerné  
     * peu importe si le fichier existe déjà ou non
     * @param bool 
     */
    static setForceUpdate(bool: boolean): void {
        this.forceUpdate = bool;
    }
    
    /**
     * Renvoie l'URI de base
     */
    static getBaseURI(): string {
        return this.baseURI;
    }

    /**
     * Logique permettant de 'naviguer' l'emploi du temps d'heure en heure,  
     * et de jour en jour, navigation bi-directionelle pour une date donnée.
     * @param date Date donnée
     * @param operator + ou -
     */
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

    /**
     * Renvoie la liste de `Cours`
     */
    public getContenu(): Cours[] {
        return this.contenu;
    }

    /**
     * Renvoie un cours situé à une date donnée
     * @param date Date de référence
     */
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
        let coursAt: Cours = <Cours>{};

        this.getContenu().forEach(cours => {
            
            // indices
            let iHeures = 0;
            let iTemps  = 1;
            let iMinutes = 1;

            let conditions_etre_dans_cours: boolean[] = [
                (aTargetTime[iHeures] == cours.start[iTemps][iHeures] && aTargetTime[iMinutes] >= cours.start[iTemps][iMinutes]),
                (aTargetTime[iHeures] == cours.end[iTemps][iHeures]   && aTargetTime[iMinutes] <  cours.end[iTemps][iMinutes]),
                (aTargetTime[iHeures] >  cours.start[iTemps][iHeures] && aTargetTime[iHeures] <  cours.end[iTemps][iHeures])
            ];
            if (conditions_etre_dans_cours.some(x=>x)) {
                if ((aTargetDate[0] == cours.start[0][0] && aTargetDate[1] == cours.start[0][1] && aTargetDate[2] == cours.start[0][2]))
                    coursAt = cours;
            }
        })
        return coursAt;
    }


    /**
     * Renvoie le cours suivant relatif à une date donnée  
     * Si l'heure dépasse l'heure maximale à laquelle un cours peut avoir lieu  
     * on cherche sur le jour suivant, même chose pour les weekends.  
     * @param date Date de référence
     */    
    public getCoursSuivant(date: Date = new Date()): Cours {
        
        let cours: Cours = this.getCoursAt(date);
        do {
            this.getCoursSharedLogic(date, '+');
            cours = this.getCoursAt(date);
        } while(Object.keys(cours).length == 0); // Tant que la valeur renvoyée est `null`;
        return cours;
    }


    /**
     * Renvoie le cours précédent relatif à une date donnée  
     * Si l'heure dépasse l'heure maximale à laquelle un cours peut avoir lieu  
     * on cherche sur le jour suivant, même chose pour les weekends.  
     * @param date Date de référence
     */  
    public getCoursPrécédent(date: Date = new Date()): Cours {

        let cours: Cours = this.getCoursAt(date);

        do {
            this.getCoursSharedLogic(date, '-');
            cours = this.getCoursAt(date);
        } while(Object.keys(cours).length == 0); // Tant que la valeur renvoyée est `null`;

        return cours;
    }

    public getTrousSuivant() {
        return;
    }

    public toString() {
        return `Emplois du temps du groupe ${this.groupe.toString()}: ${this.contenu.length} éléments`;
    }

    public getTrousPrécédent() {
        return;
    }

    public complexSearch(...details: Array< Map<string, any> >) {
        let tries: number = 100;
        let found: boolean = false;

        let targetDate: Date = new Date();
        if (Object.keys(details).indexOf("date") > -1) {
            return; // to be implemented
        }
        while (tries > 0 && !found) {

        }
        for (let detail in details) {

        }
    }

}