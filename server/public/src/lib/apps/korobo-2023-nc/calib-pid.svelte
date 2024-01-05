<script>
  import TextInput from "$lib/ui/text_input.svelte";

  export let p_gain = 2.7;
  export let i_gain = 0.0;
  export let d_gain = 0.000015;

  let p_gain_text = p_gain.toString();
  let i_gain_text = i_gain.toString();
  let d_gain_text = d_gain.toString();

  $: p_gain = parseFloat(p_gain_text);
  $: i_gain = parseFloat(i_gain_text);
  $: d_gain = parseFloat(d_gain_text);
</script>

<div class="container">
  <div class="meter">
    <div class="area">P Gain</div>
    <div class="area">I Gain</div>
    <div class="area">D Gain</div>
  </div>
  <div class="gain">
    <div class="label">
      <span>P Gain</span>
    </div>
    <TextInput bind:value={p_gain_text}></TextInput>
  </div>
  <div class="gain">
    <div class="label">
      <span>I Gain:</span>
    </div>
    <TextInput bind:value={p_gain_text}></TextInput>
  </div>
  <div class="gain">
    <div class="label">
      <span>D Gain:</span>
    </div>
    <TextInput bind:value={p_gain_text}></TextInput>
  </div>
</div>

<style lang="scss">
  div.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 100%;

    div.meter {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      height: 50px;
      width: 100%;
      div.area {
        height: 100%;
        width: 33%;

        text-align: center;
        line-height: 50px;
      }
      div.area:nth-child(1) {
        background-color: #ff000022;
      }
      div.area:nth-child(2) {
        background-color: #00ff0022;
      }
      div.area:nth-child(3) {
        background-color: #0000ff22;
      }
    }
    div.gain {
      flex: 1 1 auto;
      display: flex;
      flex-direction: row;
      width: 100%;
      background-color: #eee;
      div.label {
        position: relative;
        width: 100px;
        span {
          width: 100px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
    div.gain:nth-child(n + 1) {
      margin-top: 10px;
    }
  }
</style>
