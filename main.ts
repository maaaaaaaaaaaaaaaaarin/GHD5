export {};

import {EmploisDuTemps} from "./EmploisDuTemps";
import {Groupe} from "./Groupe";

let main: Function;
(main = () : void => {

    EmploisDuTemps.setForceUpdate(true);
    //console.log("TC[0]: " + TypeCours[0]);
    //console.log("TC[CM]: " + TypeCours["CM"]);
    let edt: EmploisDuTemps = new EmploisDuTemps(new Groupe(3, "D"), () => {
        console.log("hi");
        console.log(edt.getCoursSuivant());
    });

    //console.log(edt.getCoursSuivant());
})();