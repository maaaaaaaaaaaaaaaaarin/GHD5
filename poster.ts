import request from 'request';


let test_req = {
    "hello":"world",
    "world":2,
    "question":"testing"
}
let test_cours_suivant = {
    "question":"premier-cours",
    "groupe":"S3D",
    "date-time":"2020-01-07T16:18:33+01:00"
}
let test_cours_suivant_no_date = {
    "queryResult":{
        "parameters": {
            "question":"fin-cours",
            "groupe":"S3D",
            "date-time":""
        }
    }
}
let test_salle = {
    "queryResult":{
        "parameters": {
            "question":"salle",
            "groupe":"S3D",
            "date-time":"2020-01-09T10:18:33+01:00"
        }
    }
}
const req = {
    url:'http://localhost/webhook',
    method:'POST',
    json: test_salle
}

request(req, (err, res, body) => {
    console.log(body.fulfillmentMessages[0]);
    // let stuff: string = "\n";
    // Object.values(body).forEach((key, index) => {
    //     stuff+=`\t${Object.keys(body)[index]} : ${key}\n`
    // });
    // console.log(`
        
    //     Server response:
    //     ${stuff}      
    // `);
    // for (var property in body.fulfillmentMessages[0]) {
    //     console.log(property + ': ' + body.fulfillmentMessages[property]+'; ');
    //   }

    
});