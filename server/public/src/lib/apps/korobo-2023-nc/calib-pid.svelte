<script>
  import TextInput from "$lib/ui/text_input.svelte";
  import VertialSlider from "$lib/ui/vertial_slider.svelte";

  export let gain = 0;
  export let p_gain = 2.7;
  export let i_gain = 0.0;
  export let d_gain = 0.000015;

  // let p_gain_text = p_gain.toString();
  // let i_gain_text = i_gain.toString();
  // let d_gain_text = d_gain.toString();

  // $: p_gain = isNaN(parseFloat(p_gain_text)) ? 0 : parseFloat(p_gain_text);
  // $: i_gain = isNaN(parseFloat(i_gain_text)) ? 0 : parseFloat(i_gain_text);
  // $: d_gain = isNaN(parseFloat(d_gain_text)) ? 0 : parseFloat(d_gain_text);

  let p_percent = 33;
  let i_percent = 33;
  let d_percent = 33;

  $: p_percent = (p_gain / (p_gain + i_gain + d_gain)) * 100.0;
  $: i_percent = (i_gain / (p_gain + i_gain + d_gain)) * 100.0;
  $: d_percent = (d_gain / (p_gain + i_gain + d_gain)) * 100.0;

  let p_slider = 0.1; // -1 ~ 1
  let i_slider = 0.1; // -1 ~ 1
  let d_slider = 0.1; // -1 ~ 1

  $: p_gain = ((p_slider + 1) / 2) * 10;
  $: i_gain = ((i_slider + 1) / 2) * 10;
  $: d_gain = ((d_slider + 1) / 2) * 10;

  let gain_formula = "1";
  let gain_formula_error = false;
  $: {
    try {
      gain = eval(gain_formula);
      gain_formula_error = false;
    } catch (e) {
      gain = 0;
      gain_formula_error = true;
    }
  }
</script>

<div class="container">
  <div class="meter">
    <div class="area" style="width: {p_percent}%;">
      P {Math.round(p_percent)}%
    </div>
    <div class="area" style="width: {i_percent}%;">
      I {Math.round(i_percent)}%
    </div>
    <div class="area" style="width: {d_percent}%;">
      D {Math.round(d_percent)}%
    </div>
  </div>
  <div class="gain">
    <div
      class="label"
      style="border-right: 10px solid {gain_formula_error
        ? '#cc8888'
        : '#88cc88'}"
    >
      <span>Gain:</span>
    </div>
    <TextInput bind:value={gain_formula}></TextInput>
  </div>
  <div class="gain">
    <div class="label">
      <span>P:</span>
    </div>
    <VertialSlider style="width: 100%;" height={40} bind:value={p_slider}
    ></VertialSlider>
    <div class="label"><span>{p_gain.toFixed(5)}</span></div>
  </div>
  <div class="gain">
    <div class="label">
      <span>I:</span>
    </div>
    <VertialSlider style="width: 100%;" height={40} bind:value={i_slider}
    ></VertialSlider>
    <div class="label"><span>{i_gain.toFixed(5)}</span></div>
  </div>
  <div class="gain">
    <div class="label">
      <span>D:</span>
    </div>
    <VertialSlider style="width: 100%;" height={40} bind:value={d_slider}
    ></VertialSlider>
    <div class="label"><span>{d_gain.toFixed(5)}</span></div>
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

      margin-bottom: 0px 5px 5px 5px;
      border-bottom: 1px solid black;
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
      margin-top: 5px;
    }
  }
</style>
