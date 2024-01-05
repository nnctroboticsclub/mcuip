<script>
  import TextInput from "$lib/ui/text_input.svelte";

  export let p_gain = 2.7;
  export let i_gain = 0.0;
  export let d_gain = 0.000015;

  let p_gain_text = p_gain.toString();
  let i_gain_text = i_gain.toString();
  let d_gain_text = d_gain.toString();

  $: p_gain = isNaN(parseFloat(p_gain_text)) ? 0 : parseFloat(p_gain_text);
  $: i_gain = isNaN(parseFloat(i_gain_text)) ? 0 : parseFloat(i_gain_text);
  $: d_gain = isNaN(parseFloat(d_gain_text)) ? 0 : parseFloat(d_gain_text);

  let p_percent = 33;
  let i_percent = 33;
  let d_percent = 33;

  $: p_percent = (p_gain / (p_gain + i_gain + d_gain)) * 100.0;
  $: i_percent = (i_gain / (p_gain + i_gain + d_gain)) * 100.0;
  $: d_percent = (d_gain / (p_gain + i_gain + d_gain)) * 100.0;
</script>

<div class="container">
  <div class="meter">
    <div class="area" style="width: {p_percent}%;">P</div>
    <div class="area" style="width: {i_percent}%;">I</div>
    <div class="area" style="width: {d_percent}%;">D</div>
  </div>
  <div class="gain">
    <div class="label">
      <span>P Gain:</span>
    </div>
    <TextInput bind:value={p_gain_text}></TextInput>
    <div class="label"><span>{Math.round(p_percent)}%</span></div>
  </div>
  <div class="gain">
    <div class="label">
      <span>I Gain:</span>
    </div>
    <TextInput bind:value={i_gain_text}></TextInput>
    <div class="label"><span>{Math.round(i_percent)}%</span></div>
  </div>
  <div class="gain">
    <div class="label">
      <span>D Gain:</span>
    </div>
    <TextInput bind:value={d_gain_text}></TextInput>
    <div class="label"><span>{Math.round(d_percent)}%</span></div>
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
