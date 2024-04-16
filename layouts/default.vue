<template>
  <div class="flex flex-col w-full h-screen overflow-hidden bg-zinc-900">
    
    <div class="logo w-full flex items-center justify-center py-4">
      <img src="../assets/img/knight.png" width="64"  alt="Portcullis logo icon">
      <p class="text-white titles uppercase text-5xl">portcullis</p>
    </div>

    <main class="flex-grow w-full h-full p-4 mx-auto max-w-7xl">
      <Nuxt />
    </main>
    <footer class="flex items-center justify-center w-full h-16 text-white">
        <p class="text-slate-500">
          Portcullis Guardian &copy; {{ new Date().getFullYear() }}
        </p>
    </footer>
  </div>
</template>