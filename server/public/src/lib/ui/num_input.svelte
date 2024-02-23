<script lang="ts">
  import TextInput from "./text_input.svelte";

  export let value: number = 0;
  export let width: string = "100%";
  export let height: string = "100%";
  export let line_height: string = "1em";

  let value_text = value.toString();
  $: value = parseFloat(value_text);
</script>

<TextInput bind:value={value_text} {width} {height} {line_height} />
