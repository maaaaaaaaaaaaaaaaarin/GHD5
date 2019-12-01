export enum TypeCours {
    "CM", "TP", "TD", "Exam"
}

export interface Cours {
    start  : number[][];
    end    : number[][];
    salle  : String;
    type   : TypeCours;
    prof   : String;
    matière: String;
}