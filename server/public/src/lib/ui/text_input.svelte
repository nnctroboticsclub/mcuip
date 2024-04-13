<script lang="ts">
  export let value: string = "";
  export let width: string = "100%";
  export let height: string = "100%";
  export let line_height: string = "1em";

  export let style: string = "";
</script>

<input
  type="text"
  bind:value
  style="width: {width}; height: {height}; line-height: {line_height}; {style}"
/>

<style>
  input {
    display: inline-block;
    border: none;
    outline: none;
    background-color: #333333;
    color: white;
    padding: 0.5em;
  }
</style>
