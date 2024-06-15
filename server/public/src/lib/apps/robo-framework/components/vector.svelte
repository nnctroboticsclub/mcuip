<script lang="ts">
  import Button from "$lib/ui/button.svelte";
  import { type Writable } from "svelte/store";
  import { App } from "../korobo2023nc";

  export let configure_mode: boolean;
  export let motor: {
    rot: Writable<number>;
    drive: Writable<number>;
    error: Writable<number>;
    p_gain: Writable<number>;
    i_gain: Writable<number>;
    d_gain: Writable<number>;
    rot_fb: Writable<number>;
    rot_out: Writable<number>;
  };

  export let motor_inverse_key: string;

  let theta = motor.rot;
  let radius = motor.drive;

  let error = motor.error;
  let p_gain = motor.p_gain;
  let i_gain = motor.i_gain;
  let d_gain = motor.d_gain;
  let rot_fb = motor.rot_fb;
  let rot_out = motor.rot_out;

  const app = App.get_instance();
</script>

<div class="container">
  <div
    class="arrow"
    style="transform: rotate({$theta + 90}deg); height: {$radius}px;"
  >
    {#if !configure_mode}
      <div
        class="text"
        style={"position: absolute;" +
          "top: 0;" +
          "left: 0;" +
          "font-size: 14px;" +
          `transform: translateY(${$radius / 2 - 10}px) translateX(-50%) rotate(${-$theta - 90}deg);`}
      >
        {#if $error > 0}
          <nobr style="color: red;">ERR: {$error.toFixed(2)}</nobr>
        {:else}
          <nobr style="color: green;">ERR: {$error.toFixed(2)}</nobr>
        {/if}
        <nobr>
          PID; ({$p_gain.toFixed(2)}, {$i_gain.toFixed(2)}, {$d_gain.toFixed(
            2
          )})
        </nobr>
        <nobr>Rot; G: {$theta.toFixed(2)} F: {$rot_fb.toFixed(2)}</nobr>
        <nobr>&nbsp;&nbsp;&nbsp;; O: {$rot_out.toFixed(2)}</nobr>
      </div>
    {:else}
      <div
        class="text"
        style={"position: absolute;" +
          "top: 0;" +
          "left: 0;" +
          "font-size: 14px;" +
          `transform: translateY(${$radius / 2 - 10}px) translateX(-50%) rotate(${-$theta - 90}deg);`}
      >
        <Button
          style="position: absolute; top: -50px; left: -50px; border: 1px solid blue;"
          color="transparent"
          active_color="#00f1"
          width="40px"
          height="40px"
          on:click={() => {
            app.controls.bool[motor_inverse_key].prev =
              !app.controls.bool[motor_inverse_key].prev;
          }}
        >
          Inv
        </Button>
      </div>
    {/if}
  </div>
</div>

<style>
  .container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .arrow {
    position: absolute;
    width: 10px;
    height: 100%;
    background-color: #f008;
    background-size: contain;
  }
  .arrow::after {
    content: "";
    display: block;
    background-color: #f008;
    width: 20px;
    height: 20px;
    clip-path: polygon(0 100%, 100% 100%, 50% 0);
    transform: translate(-25%, -100%);
  }
</style>
