import { readFileSync } from "fs";

export class Groupe {
    
    private année : number;
    private groupe: string;

    private static codes = JSON.parse(readFileSync("codeGroupes.json").toString());

    constructor(année: number, groupe: string) {
        this.année = année;
        this.groupe = groupe;
        
    }

    static getCode(année: number, groupe: string): string {
        return this.codes[`${année}`][groupe];
    }

    static getCodes(): Object {
        return this.codes;
    }

    public getAnnée(): number {
        return this.année;
    }

    public getGroupe(): string {
        return this.groupe;
    }

    public toString(): string {
        return `S${this.année.toString()}${this.groupe.toString()}`;
    }

}