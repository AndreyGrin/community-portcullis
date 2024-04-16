import CryptoJS from 'crypto-js'

interface CryptoConstructor {
	new (): ICrypto;
}

interface ICrypto {
	encrypt(value: string | string[]): string,
	decrypt(value: string | string[]): string,
}

class Crypto implements ICrypto {
    passphrase;

	constructor(){
        this.passphrase = process.env.PASSPHRASE || '';
    }

	encrypt(value:string){
		return CryptoJS.AES.encrypt(value, this.passphrase).toString();
	}

    decrypt(value: string){
		const bytes = CryptoJS.AES.decrypt(value!, this.passphrase);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText;
	}
}
export const crypto = new Crypto();
