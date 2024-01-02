<script>
  import Window from "$lib/window/window.svelte";
  import Korobo2023ncMain from "./korobo-2023-nc/korobo2023nc-main.svelte";
</script>

<Window>
  <svelte:fragment slot="title"
    >うおおおおおおおおおお 2023 交ロボ</svelte:fragment
  >
  <svelte:fragment slot="app">
    <Korobo2023ncMain></Korobo2023ncMain>
  </svelte:fragment>
</Window>
