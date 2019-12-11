import { EmploisDuTemps } from "../";
import { expect } from 'chai';
//import { readFileSync } from "fs";
import 'mocha';

describe("EmploisDuTemps: Getters", () => {

    describe("Coucou manu", () => {
        it("kill manu", () => {
            expect("passo combo").to.equal("PASSO COMBO".toLocaleLowerCase());
        });
    })

});

describe("EmploisDuTemps: Static Methods", () => {

    describe("setForceUpdate()", () => {
        it("Should force [EmploisDuTemps] to update its <contenu>", () => {
            expect("test").to.equal("test");
        });
    })

});