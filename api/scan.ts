import type { IncomingMessage, ServerResponse } from 'http'
import url from 'url'
import axios from 'axios'

export default async (req: IncomingMessage, res: ServerResponse) => { 
    const query = url.parse(req.url || '', true).query;

    if( !query.address){
        res.setHeader("content-type", "application/json");
        res.statusCode = 400;
        res.end({'message': 'Invalid wallet address'});
    }

    let response = await axios.post('https://kusama.api.subscan.io/api/v2/scan/search', {
        "key": query.address,
        "row": 20,
        "page": 1
    }, {
        headers: {
        "X-API-Key": process.env.SUBSCAN_API || '',
        "Content-Type": "application/json"
        }
    });

    res.setHeader("content-type", "application/json");
    res.statusCode = 200;
    res.end(`${JSON.stringify(response.data)}`);
}