export class Logger {
    static info(s: any) {
        console.log("[INFO]\t" + s);
    }
    static error(s: any) {
        console.error("[ERR]\t" + s);
        throw new Error(s);
    }
}