<template>
  <div>
		<div class="text-center mb-6">Few simple steps to get authorised in the community</div>

		<div class="flex justify-center justify-items-center">
			<div class="p-3 w-1/3">
				<div>1.</div>
				<strong>Polkadot{.js} wallet</strong>
				<p>Make usre your browser has wallet installed and accept our authorise request.</p>
			</div>

			<div class="p-3 w-1/3">
				<div>2.</div>
				<strong>Wallet check</strong>
				<p>Select preferable wallet from the dropdown or just press Authorise if you have only 1 address. You wallet must be visible on Kusama chain.</p>
			</div>

			<div class="p-3 w-1/3">
				<div>3.</div>
				<strong>Balance check</strong>
				<p>You should hold minimum required balance of 1 KSM to be successfuly authorised.</p>
			</div>
		</div>
		
		<div class="flex justify-center mt-6">
			<div class="w-1/2">
				<Authorise :token="$route.query.token" :user="userDetails" v-if="tokenValid === true" />

				<el-alert v-if="tokenValid === false && token" title="Whoops!" type="warning" effect="dark" :closable="false">
					{{errMessage}} Or close this page if you already have been authorised.
				</el-alert>

				<el-alert v-if="!token" title="Whoops!" type="warning" effect="dark" :closable="false">
					Only users with special link can be authorised. Follow link sent to you by Portcullis bot if you have one.
				</el-alert>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

export default Vue.extend({
  name: 'InstructionsPage',
  key: 'instructions',
  created() {
		this.validateToken(this.$route.query.token);
	},
	data () {
		return {
			errMessage: null || '',
			tokenValid: null || false,
			userDetails: null,
			token: ''
		}
	},
	methods: {
		async validateToken( token: any ){
			this.token = token;

			try{
				if( typeof token !== 'undefined' ){
					const { data } = await axios(`/api/kv?token=${token}`, {
						headers: {
							'Content-Type': 'text/plain' 
						},
						method: 'GET'
					});

					this.tokenValid = true;
					this.userDetails = data;

					return;
				}

				throw 'Undefined token';
			} catch( err ){
				this.tokenValid = false;
				this.errMessage = 'Wrong or missing token. Go back to your chat server and try again.'
			}
		}
	}
})
</script>
