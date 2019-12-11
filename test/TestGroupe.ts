import { Groupe } from "../";
import { expect } from 'chai';
import { readFileSync } from "fs";
import 'mocha';


let gp         : Groupe;
let test_groupe: string;
let test_année : number;

let codes: JSON = JSON.parse(readFileSync("codeGroupes.json").toString());

before(() => {
  test_groupe = "D";
  test_année  = 3;
  gp          = new Groupe(test_année, test_groupe);
});

after(() => {
  gp = null;
});

describe('Groupe: Getters', () => {
    describe('getGroupe()', () => {
      it("Should return a [Groupe]'s <groupe> attribute", () => {
        expect(gp.getGroupe()).to.equal(test_groupe);
      });
    });
    describe('getAnnée()', () => {
      it("Should return a [Groupe]'s <année> attribute", () => {
        expect(gp.getAnnée()).to.equal(test_année);
      });
    });
    describe('toString()', () => {
      it('Should return a [Groupe]\'s string representation as follows: "S<année><groupe>"', () => {
        expect(gp.toString()).to.equal(`S${test_année}${test_groupe}`);
      });
    });
});

describe("Groupe: Static Methods", () => {
  describe("getCode()", () => {
    it("Should return a [Groupe]'s code as seen on the planning website", () => {
      expect(Groupe.getCode(test_année, test_groupe)).to.equal(codes[test_année.toString()][test_groupe]);
    });
  });
  describe("getCodes()", () => {
    it("Should return the static <codes> of the [Groupe] object", () => {
      // Comparaison des objets directement impossible:
      // si a = {test:1} et b = a;  a == b => false
      expect(JSON.stringify(Groupe.getCodes())).to.equal(JSON.stringify(codes));
    });
  })
});