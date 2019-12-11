import request from 'request';

const req = {
    url:'http://localhost/webhook',
    method:'POST',
    json: {
        "hello":"world",
        "1+1":2,
    }
}

request(req, (err, res, body) => {
    console.log(`
        
        Server response:

            ${body}

            
    `);
});