<script lang="ts">
  export let value: string = "";
</script>

<input type="text" bind:value />

<style>
  input {
    width: 100%;
    height: 100%;
    font-size: 1.5em;
    border: none;
    outline: none;
    background-color: #333333;
    color: white;
  }
</style>
