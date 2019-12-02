import { 
    Cours,
    TypeCours
} from ".";

export class icsToJson {
    
    private NEW_LINE: RegExp    = /\r\n|\n|\r/;
    private EVENT: string       = "VEVENT";
    private EVENT_START: string = "BEGIN";
    private EVENT_END: string   = "END";
    private START_DATE: string  = "DTSTART";
    private END_DATE: string    = "DTEND";
    private DESCRIPTION: string = "DESCRIPTION";
    private SUMMARY: string     = "SUMMARY";
    private LOCATION: string    = "LOCATION";
    private ALARM: string       = "VALARM";

    private json: Cours[] = [];
    private ics : string;

    public getJSON(): Cours[] {
        return this.json;
    }

    private dateToArray(dtString: string): number[][] {
        let out = [];
        // 20191118T082800Z
        let [a_date, a_heure] = dtString.split("T");
        let date  = [a_date.substring(0,4), a_date.substring(4,6), a_date.substring(6,8)];
        let heure = [`${(Number(a_heure.substring(0,2))/1)+1}`, a_heure.substring(2,4)];
        // >= 8:15 --> 8:30
        // <  8:15 --> 8:00
        if (["30", "00"].indexOf(heure[1]) == -1) {
            heure[1] = ((Math.round(Number(a_heure[1])/10)*10) >= 20 ? "30" : "0")
        }

        return [date.map(x=>Number(x)), heure.map(x=>Number(x))];
    }

    constructor(icsData: string ) {

        this.ics  = icsData;

        let currentObj: Cours = <Cours>{};
        let creatingObj       = false;

        let lines = icsData.split(this.NEW_LINE);

        lines.forEach((element: string) => {
            
            if (element.startsWith(`${this.EVENT_END}:${this.EVENT}`)) {
                this.json.push(currentObj);
                currentObj  = <Cours>{};
                creatingObj = false;
            } else if (element.startsWith(`${this.EVENT_START}:${this.EVENT}`)) {
                currentObj  = <Cours>{};
                creatingObj = true;
            } else if (creatingObj) {
                let [entete, value] = element.split(":");
                if (entete == this.START_DATE) {
                    currentObj.start = this.dateToArray(value);
                } else if (entete == this.END_DATE ) {
                    currentObj["end"]   = this.dateToArray(value);
                } else if (entete == this.SUMMARY ) {
                    let [type, matière] = value.split('-').map(x => x.trim());
                    currentObj["matière"] = matière.split("\\")[0];
                    currentObj["type"] = TypeCours[type];
                } else if (entete == this.DESCRIPTION ) {
                    let prof = element.split("\\")[1].split(":")[1].trim();
                    currentObj["prof"] = prof;
                } else if (entete == this.LOCATION) {
                    currentObj["salle"] = String(value.replace("\\", "").replace(",", "").split(" "));
                }
            }
        });
    }

}