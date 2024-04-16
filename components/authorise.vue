<template>
	<div class="my-5">
		<div class="bg-indigo-900 shadow-lg shadow-black rounded p-5 text-white">
			<el-alert v-if="!extensions" title="Whoops!" type="warning" effect="dark" :closable="false">
				You don't have polkadot extension in your browser or you didn't authorise this page to access it.
			</el-alert>

			<div v-if="!authorised" class="text-center">
				<div v-if='accountsList.length === 1' class="font-xs">
					{{ accountsList[0].label }}
				</div>
				<el-select
					v-model="userAccount"
					:options="accountsList"
					placeholder="Please select"
					size="large"
					v-else
				/>
				<br>
				<el-button type="primary" :loading="loading" class="mt-5" @click="checkBalance()">Authorise wallet</el-button>

				<el-alert v-if="validationError.visible" :title="validationError.title" type="warning" effect="dark"  :closable="false" class="mt-5">
					<p v-html="validationError.content"></p>
				</el-alert>
			</div>
			<el-alert title="You have been authorised" type="success" effect="dark" :closable="false" v-else>
				Enjoy full community experience!
			</el-alert>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	props: ['token', 'user'],
	data(){
		return {
			extensions: null,
			accountsList: [],
			userAccount: null,
			userId: null,
			authorised: false,
			validationError: {
				title: '',
				content: '',
				visible: false
			},
			serverSettings: null,
			minBalance: 0.04,
			loading: false
		}
	},
	created(){
		this.readPolkadotExtension();
		this.getServerSettings();
	},
	methods: {
		async readPolkadotExtension(){
			const polkadot = await this.$getPolkadotExtension();

			this.extensions = polkadot.extensions;
			this.accountsList = polkadot.addressList || [];
			this.userAccount = polkadot.addressList.length > 1 ? null : polkadot.addressList[0].value;
		},
		clearErrors(){
			this.validationError.title = '';
			this.validationError.content = '';
			this.validationError.visible = false;

			return;
		},
		showError( title, content ){
			this.validationError.title = title;
			this.validationError.content = content;
			this.validationError.visible = true;

			return;
		},
		async getServerSettings(){
			const { data, status } = await axios(`/api/kv?token=${this.token}&serverOnly=true`, {
				headers: {
					'Content-Type': 'text/plain' 
				},
				method: 'GET'
			});

			this.serverSettings = data;
			this.minBalance = data.minBalance;
			return;
		},
		async checkBalance(){
			this.clearErrors();
			this.loading = true;

			const { data } = await axios(`/api/scan?address=${this.userAccount}`, {
				headers: {
					'Content-Type': 'text/plain' 
				},
				method: 'GET'
			});

			if( data.code === 0 ){
				if( data.data.account.balance >= this.minBalance ){
					this.updateUserDetails();
					
					return;
				}

				this.showError('Low wallet balance', `You wallet has less then ${this.minBalance}KSM required on it's balance.`);
			} else if(data.code === 10004){
				this.showError(
					'Wallet address not found',
					`Your wallet is not visible on the chain. Might be that your balance is less then Existential Deposit amount. Check <a href="https://support.polkadot.network/support/solutions/articles/65000168651-what-is-the-existential-deposit-" target="_blank">this article</a> for more details, top up your wallet and try again.`
				);
			}

			this.loading = false;

			return;
		},
		async updateUserDetails(){
			const userData = this.user;

			const { data } = await axios(`/api/kv`, {
				headers: {
					'Content-Type': 'text/plain' 
				},
				method: 'PUT',
				data: {
					key: this.token,
					value: JSON.stringify({
						...userData,
						...{
							wallet: this.userAccount,
							verifificated: Date.now(),
							platform: 'kusama' 
						}
					})
				}
			});

			await this.deleteUnverifiedUser();

			this.authorised = true;
			this.loading = false;

			return;
		},
		async deleteUnverifiedUser(){
			const { data } = await axios(`/api/kv?token=${this.token}`, {
				headers: {
					'Content-Type': 'text/plain' 
				},
				method: 'DELETE'
			});

			this.userId = data;
		}
	}
}
</script>