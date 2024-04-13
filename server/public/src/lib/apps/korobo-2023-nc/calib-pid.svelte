<script>
  import { DerivedWritable } from "$lib/stores/derived_writable";
  import TextInput from "$lib/ui/text_input.svelte";
  import VertialSlider from "$lib/ui/vertial_slider.svelte";
  import { writable } from "svelte/store";

  export let gain = 0;
  export let p_gain = 2.7;
  export let i_gain = 0.0;
  export let d_gain = 0.000015;

  let p_percent = 33;
  let i_percent = 33;
  let d_percent = 33;

  $: p_percent = (p_gain + i_gain + d_gain) == 0 ? 33 : (p_gain / (p_gain + i_gain + d_gain)) * 100.0;
  $: i_percent = (p_gain + i_gain + d_gain) == 0 ? 33 : (i_gain / (p_gain + i_gain + d_gain)) * 100.0;
  $: d_percent = (p_gain + i_gain + d_gain) == 0 ? 33 : (d_gain / (p_gain + i_gain + d_gain)) * 100.0;

  // -1 ~ 1
  let p_slider = new DerivedWritable(
    writable(0),
    (_) => (p_gain / 10) * 2 - 1,
    (_, v) => {
      p_gain = ((v + 1) / 2) * 10;
      return 0;
    }
  );

  let i_slider = new DerivedWritable(
    writable(0),
    (_) => (i_gain / 10) * 2 - 1,
    (_, v) => {
      i_gain = ((v + 1) / 2) * 10;
      return 0;
    }
  );

  let d_slider = new DerivedWritable(
    writable(0),
    (_) => (d_gain / 10) * 2 - 1,
    (_, v) => {
      d_gain = ((v + 1) / 2) * 10;
      return 0;
    }
  );

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
      class="label type"
      style="border-right: 1px solid {gain_formula_error
        ? '#cc8888'
        : '#88cc88'}"
    >
      <span style="border-bottom: 5px solid {gain_formula_error
        ? '#cc8888'
        : '#88cc88'}">Gain:</span>
    </div>
    <TextInput width="" style="flex: 1 1 auto;" bind:value={gain_formula}></TextInput>
  </div>
  <div class="gain">
    <div class="label type">
      <span>P:</span>
    </div>
    <VertialSlider style="flex: 1 1 auto;" height={40} bind:value={$p_slider}
    ></VertialSlider>
    <div class="label val"><span>{p_gain.toFixed(5)}</span></div>
  </div>
  <div class="gain">
    <div class="label type">
      <span>I:</span>
    </div>
    <VertialSlider style="flex: 1 1 auto;" height={40} bind:value={$i_slider}
    ></VertialSlider>
    <div class="label val"><span>{i_gain.toFixed(5)}</span></div>
  </div>
  <div class="gain">
    <div class="label type">
      <span>D:</span>
    </div>
    <VertialSlider style="flex: 1 1 auto;" height={40} bind:value={$d_slider}
    ></VertialSlider>
    <div class="label val"><span>{d_gain.toFixed(5)}</span></div>
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

        &.type {
          width: 80px;
          border-right: 1px solid #ccc;
        }
        &.val {
          width: 70px;
        }

        span {
          position: absolute;
          width: 100%;
          overflow-x: hidden;
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
