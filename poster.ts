import request from 'request';

const req = {
    url:'http://localhost/webhook',
    method:'POST',
    json: {
        "hello":"world",
        "world":2,
    }
}

request(req, (err, res, body) => {
    console.log(`
        
        Server response:

            ${body}

            
    `);
});