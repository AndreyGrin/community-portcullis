import axios from 'axios'

interface KVConstructor {
	new (): IKV;
}

interface IKV {
	get(key: string): void,
	put(key: string, value: string): object,
}

export class KV implements IKV {
	kvBaseUrl; cfNameSpaceId; cfAccountId; cfAuthKey; cfEmail;

	constructor( destination:string ){
		this.cfAccountId = process.env.KV_ACCOUNT_ID;
		this.cfAuthKey = process.env.KV_API_KEY;
		this.cfEmail = process.env.KV_EMAIL;
		this.cfNameSpaceId = destination === 'verified' ? process.env.KV_NAMESPACE_VERIFIED : process.env.KV_NAMESPACE_UNVERIFIED;
		this.kvBaseUrl = `https://api.cloudflare.com/client/v4/accounts/${this.cfAccountId}/storage/kv/namespaces/${this.cfNameSpaceId}/values`;
	}

	async get(key:string){
		try {
			const { data } = await axios(`${this.kvBaseUrl}/${key}`, {
				headers: {
					'X-Auth-Email': this.cfEmail || '',
					'X-Auth-Key': this.cfAuthKey || '',
					'Content-Type': 'text/plain' 
				},
				method: 'GET'
			});

			return data;
		} catch (err) {
			throw new Error('Unable to find a user.')
		}
	}

	async put(key:string, value:string){
		const { data } = await axios(`${this.kvBaseUrl}/${key}`, {
			headers: {
				'X-Auth-Email': this.cfEmail || '',
				'X-Auth-Key': this.cfAuthKey || '',
				'Content-Type': 'text/plain' 
			},
			method: 'PUT',
			data: value
		});

		return data;
	}

	async delete( key:string ){
		try {
			const { data } = await axios(`${this.kvBaseUrl}/${key}`, {
				headers: {
					'X-Auth-Email': this.cfEmail || '',
					'X-Auth-Key': this.cfAuthKey || '',
					'Content-Type': 'text/plain' 
				},
				method: 'DELETE'
			});

			return data;
		} catch (err) {
			throw new Error('Unable to delete a user.')
		}
	}
}