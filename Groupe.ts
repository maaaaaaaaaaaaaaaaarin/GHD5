import { readFileSync } from "fs";

export class Groupe {
    
    private année : Number;
    private groupe: string;

    private static codes: Object = JSON.parse(readFileSync("codeGroupes.json").toString());

    constructor(année: Number, groupe: string) {
        this.année = année;
        this.groupe = groupe;
        
    }

    static getCode(année: Number, groupe: string): string {
        return this.codes[(<string><unknown>année)][groupe];
    }

    static getCodes(): Object {
        return this.codes;
    }

    public getAnnée(): Number {
        return this.année;
    }

    public getGroupe(): string {
        return this.groupe;
    }

    public toString(): string {
        return `S${this.année}${this.groupe}`;
    }

}