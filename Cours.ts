export enum TypeCours {
    "CM", "TP", "TD", "Exam"
}

export interface Cours {
    start  : number[][];
    end    : number[][];
    salle  : string;
    type   : string;
    prof   : string;
    matière: string;
}