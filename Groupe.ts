export class Groupe {
    
    année : Number;
    groupe: string;

    static codes: Object = {
        "3": {
            "A": "g8691",
            "B": "g8694",
            "C": "g8697",
            "D": "g8700",
            "E": "g8703"
        }
    };

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