<script lang="ts">
  export let value: string = "";
  export let width: string = "100%";
  export let height: string = "100%";
</script>

<input type="text" bind:value style="width: {width}; height: {height};" />

<style>
  input {
    font-size: 1.5em;
    border: none;
    outline: none;
    background-color: #333333;
    color: white;
  }
</style>
