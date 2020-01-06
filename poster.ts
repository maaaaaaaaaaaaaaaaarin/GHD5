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
    "question":"premier-cours",
    "groupe":"S3D",
    "date-time":""
}
const req = {
    url:'http://localhost/webhook',
    method:'POST',
    json: test_cours_suivant_no_date
}

request(req, (err, res, body) => {
    let stuff: string = "\n";
    Object.values(body).forEach((key, index) => {
        stuff+=`\t${Object.keys(body)[index]} : ${key}\n`
    });
    console.log(`
        
        Server response:
    ${stuff}

            
    `);
    
});