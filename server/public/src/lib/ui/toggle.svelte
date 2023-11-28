<script lang="ts">
  export let value: boolean;
</script>

<button class:enabled={value} on:click={() => (value = !value)}>
  <span class="square"></span>
</button>

<style>
  button {
    border: none;
    padding: 0;
    margin: 0;
    position: relative;
    height: 1.5em;
    width: 40px;

    vertical-align: middle;

    background-color: rgba(0, 0, 0, 0.25);
    border-radius: 10px;

    cursor: pointer;
  }
  button.enabled {
    background-color: rgba(0, 0, 127, 0.5);
  }
  .square {
    position: absolute;
    top: 0px;
    left: 0px;
    display: inline-block;
    width: 20px;
    height: 100%;
    margin: 0;

    box-sizing: border-box;
    border-radius: 10px;

    background-color: white;

    transition: left 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  button.enabled > .square {
    left: 20px;
  }
</style>
