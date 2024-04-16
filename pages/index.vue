<template>
  <div class="text-center">
    <p class="text-3xl font-light">NFT based safety guard to your community</p>
    
    <a class="p-3 text-white rounded bg-indigo-500 hover:bg-indigo-600 ease-in-out no-underline" href="https://discord.com/api/oauth2/authorize?client_id=922593616944308224&response_type=code&scope=bot%20applications.commands">Authorize Discord bot</a>

    <div class="h-40"></div>

    <div class="flex justify-center justify-items-center">
      <div class="p-3 w-1/3">
        <strong>Works with Kusama and NFT</strong>
        <p>Currently we support Kusama chain</p>
      </div>

      <div class="p-3 w-1/3">
        <strong>Dashboard with stats & settings <span class="font-light text-xs">[soon]</span></strong>
        <p>You have full control of settings for your audience in the community</p>
      </div>

      <div class="p-3 w-1/3">
        <strong>More chat systems, more chains <span class="font-light text-xs">[soon]</span></strong>
        <p>Telegram, Metaverses, any chain on the whole Polkadot parachain</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'IndexPage'
})
</script>
