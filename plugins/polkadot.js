import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'

export default async ({ app }, inject) => {
    inject('getPolkadotExtension', async () => {
        const extensions = await web3Enable('Portcullis guardian auth request');
        let addressList = [];
    
        if( extensions.length ){
            const allAccounts = await web3Accounts();
    
            addressList = allAccounts.map( account => {
                return {
                    label: `${account.meta.name} - ${account.address}`,
                    value: account.address
                }
            } );
        }
        
        return {
            extensions: extensions,
            addressList: addressList
        }
    });
}