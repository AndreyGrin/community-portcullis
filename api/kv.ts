import type { IncomingMessage, ServerResponse } from 'http'
import * as url from 'url'
import { KV } from '../utilities/cloudflare_kv'
import { crypto } from '../utilities/crypto'

export default async (req: IncomingMessage, res: ServerResponse) => { 
    const kv_verified = new KV('verified');
    const kv_unverified = new KV('unverified');

    switch( req.method ){
        case 'GET':
            const query = url.parse(req.url || '', true).query;

            if( !query.token ){
                res.setHeader("content-type", "application/json");
                res.statusCode = 400;
                res.end({'message': 'Invalid token'});
            }

            const user = crypto.decrypt( query.token as string );
            const serverId = user.split('-')[0];

            try {
                const kvValue = !query.serverOnly ? await kv_unverified.get( user ) : await kv_unverified.get( serverId );
                    
                res.setHeader("content-type", "application/json");
                res.statusCode = 200;
                res.end(`${JSON.stringify(kvValue)}`);
            } catch(err){
                res.setHeader("content-type", "application/json");
                res.statusCode = 400;
                res.end(`{'message': '${err}'}`);
            }
        
            break;

        case 'PUT':
            const buffers = [];

            for await (const chunk of req) {
                buffers.push(chunk);
            }

            const data = Buffer.concat(buffers).toString();
            const body = JSON.parse(data);
            const userId = crypto.decrypt( body.key );
            const kvData = await kv_verified.put(userId, body.value);

            res.setHeader("content-type", "application/json");
            
            if( kvData.success === true ){
                res.end(`OK`);
            } else {
                res.statusCode = 400;
                res.end(kvData);
            }
            break;   
        
        case 'DELETE':
            const deleteQuery = url.parse(req.url || '', true).query;

            if( !deleteQuery.token ){
                res.setHeader("content-type", "application/json");
                res.statusCode = 400;
                res.end({'message': 'Invalid token'});
            }

            const deleteUser = crypto.decrypt( deleteQuery.token as string );

            const kvDeleteData = await kv_unverified.delete(deleteUser);

            res.setHeader("content-type", "application/json");
            
            if( kvDeleteData.success === true ){
                res.end(`OK`);
            } else {
                res.statusCode = 400;
                res.end(kvDeleteData);
            }
            break;       
    }
}