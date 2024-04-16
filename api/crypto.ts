import type { IncomingMessage, ServerResponse } from 'http'
import url from 'url'
import { crypto } from '../utilities/crypto'

export default async (req: IncomingMessage, res: ServerResponse) => { 
    const query = url.parse(req.url || '', true).query;

    if( !query.token ){
        res.setHeader("content-type", "application/json");
        res.statusCode = 400;
        res.end({'message': 'Invalid token'});
    }

    const user = crypto.decrypt( query.token as string );

    res.setHeader("content-type", "application/json");
    res.statusCode = 200;
    res.end(`${user}`);
}