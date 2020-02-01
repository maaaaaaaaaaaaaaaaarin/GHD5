import { readFileSync } from "fs";

export class Groupe {
    
    private année : number;
    private groupe: string;

    private static codes = JSON.parse(readFileSync("codeGroupes.json").toString());

    constructor(année: number, groupe: string) {
        this.année = année;
        this.groupe = groupe;
        
    }

    /**
     * Renvoie le code URI pour un groupe donné   
     * @param annee
     * @param groupe 
     */
    static getCode(année: number, groupe: string): string {
        return this.codes[`${année}`][groupe];
    }

    /**
     * Renvoie les codes des groupes sous forme d'objet
     */
    static getCodes(): Object {
        return this.codes;
    }

    /**
     * Renvoie le semestre du groupe
     */
    public getAnnée(): number {
        return this.année;
    }

    /**
     * Renvoie la lettre du groupe
     */
    public getGroupe(): string {
        return this.groupe;
    }

    public toString(): string {
        return `S${this.année.toString()}${this.groupe.toString()}`;
    }

}