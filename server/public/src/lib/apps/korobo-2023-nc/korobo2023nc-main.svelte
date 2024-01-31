<script lang="ts">
  import Joystick from "$lib/ui/joystick.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TextInput from "$lib/ui/text_input.svelte";
  import Button from "$lib/ui/button.svelte";
  import Toggle from "$lib/ui/toggle.svelte";
  import { console_texts } from "$lib/console_patch";
  import SrAbe2 from "./sr-abe-2.png";
  import { onMount } from "svelte";
  import { App } from "./korobo2023nc";
  import CalibPid from "./calib-pid.svelte";
  import Vector from "./vector.svelte";
  import LastPing from "./last_ping.svelte";
  import { writable, type Writable } from "svelte/store";
  import NwLoad from "./nw_load.svelte";
  import SwerveMotor from "./swerve_motor.svelte";
  import PidError from "./PIDError.svelte";
  import RawValue from "./raw_value.svelte";

  let ready = false;
  let right_joystick_for_shot = false;

  let rotation_mode;

  let swerve: {
    motors: {
      rot: Writable<number>;
      drive: Writable<number>;
      error: Writable<number>;
    }[];
    gyro: Writable<number>;
    angle_error: Writable<number>;
  } = {
    motors: [
      { rot: writable(0), drive: writable(0), error: writable(0) },
      { rot: writable(0), drive: writable(0), error: writable(0) },
      { rot: writable(0), drive: writable(0), error: writable(0) },
    ],
    gyro: writable(0),
    angle_error: writable(0),
  };
  let network = {
    load: writable(0),
  };

  const app = App.new_instance();
  const sock = app.sock;
  onMount(() => {
    const interval = setInterval(() => {
      app.tick();
    }, 100);

    ready = true;

    return () => {
      clearInterval(interval);
    };
  });

  app.on_data(0x00, (v) => {
    function decode_angle(byte: number) {
      return (byte / 255) * 360;
    }

    function decode_magnitude(byte: number) {
      return (byte / 255) * 100;
    }

    swerve.motors[0].drive.set(decode_magnitude(v.getUint8(0)));
    swerve.motors[0].rot.set(decode_angle(v.getUint8(1)));
    swerve.motors[1].drive.set(decode_magnitude(v.getUint8(2)));
    swerve.motors[1].rot.set(decode_angle(v.getUint8(3)));
    swerve.motors[2].drive.set(decode_magnitude(v.getUint8(4)));
    swerve.motors[2].rot.set(decode_angle(v.getUint8(5)));
    swerve.gyro.set(decode_angle(v.getUint8(6)));
  });
  app.on_data(0x01, (v) => {
    function decode_error(byte: number) {
      return (byte - 128) / 127;
    }
    swerve.motors[0].error.set(decode_error(v.getUint8(0)));
    swerve.motors[1].error.set(decode_error(v.getUint8(1)));
    swerve.motors[2].error.set(decode_error(v.getUint8(2)));

    swerve.angle_error.set(decode_error(v.getUint8(3)));
  });
  app.on_data(0xfe, (v) => {
    const load = (v.getUint32(0, false) / 0x100000000) * 10000;
    network.load.set(load);
  });
</script>

<div class="container">
  <TabContainer
    style="flex-grow: 1; display: flexbox;"
    names={["Control", "Connection", "Calibration", "Vector", "Debugging"]}
    tag="2023-korobo-nc"
  >
    <TabContent
      name="Control"
      style="position: relative; height: 100%; width: 100%; flex: 1 1 auto;"
    >
      <div
        style="position: fixed; top: 50%; right: 50%;"
        class="ctrl-logo"
        class:ready
      >
        <img src={SrAbe2} width="230px" alt="logo" />
      </div>
      <Joystick
        radius={200}
        bind:x_val={app.controls.num["smx"].curr}
        bind:y_val={app.controls.num["smy"].curr}
        tag="sm"
        stick_name="Move"
        style="position: absolute; bottom: 0; left: 0;"
      />
      {#if right_joystick_for_shot}
        <Joystick
          radius={200}
          bind:x_val={app.controls.num["lha"].curr}
          bind:y_val={app.controls.num["lva"].curr}
          tag="la"
          stick_name="Launch"
          style="position: absolute; bottom: 0; right: 0;"
        />
      {:else}
        <Joystick
          radius={200}
          bind:x_val={app.controls.num["srx"].curr}
          bind:y_val={app.controls.num["sry"].curr}
          tag="sr"
          stick_name="Rotation"
          style="position: absolute; bottom: 0; right: 0;"
        />
      {/if}
      <div style="position: absolute; bottom: 250px; right: 0;">
        Shot Mode
        <Toggle bind:value={right_joystick_for_shot}></Toggle>
      </div>
      <div style="position: absolute; bottom: 220px; right: 0;">
        PID Enabled
        <Toggle bind:value={app.controls.bool["srp"].curr}></Toggle>
      </div>
      <div
        style="position: absolute; height: 5rem; bottom: 0; right: 300px; left: 300px; background-color: #eee8; overflow: hidden; line-height: 1em;"
      >
        {#each $console_texts.slice(-5) as line}
          {line.time.toTimeString().slice(0, 8)}: {line.text}<br />
        {/each}
      </div>
      <div style="position: absolute; top: 0px; left: 0px;">
        <RawValue val={swerve.gyro}></RawValue> °
      </div>
    </TabContent>
    <TabContent name="Vector">
      <div style="position: relative; margin: 0 auto; width: 200px; top: 70px;">
        <div style="position: absolute; top: 0px; left: 100px;">
          <Vector radius={swerve.motors[0].drive} theta={swerve.motors[0].rot}
          ></Vector>
        </div>

        <div
          style="position: absolute; top: calc(200px * 0.8660254); left: 200px;"
        >
          <Vector radius={swerve.motors[1].drive} theta={swerve.motors[1].rot}
          ></Vector>
        </div>

        <div
          style="position: absolute; top: calc(200px * 0.8660254); left: 0px;"
        >
          <Vector radius={swerve.motors[2].drive} theta={swerve.motors[2].rot}
          ></Vector>
        </div>
      </div>
    </TabContent>
    <TabContent name="Debugging" style="font-size: smaller;">
      &gt;LOCAL <br />
      &nbsp;Is connected to esp32?:
      <span style="background-color: #{$sock ? '00ff' : 'ff00'}0044;"
        >&nbsp;&nbsp;</span
      >&nbsp;{$sock ? "Yes" : "No"} <br />
      &gt;PHYSICAL <br />
      &nbsp;&gt;SWERVE <br />
      &nbsp;&nbsp;Robot Angle Errors: <PidError val={swerve.angle_error} /><br
      />
      &nbsp;&nbsp;Angle Errors: [<PidError val={swerve.motors[0].error} />, <PidError
        val={swerve.motors[1].error}
      />, <PidError val={swerve.motors[2].error} />] <br />
      &nbsp;&nbsp;Motor0: <SwerveMotor motor={swerve.motors[0]}></SwerveMotor>
      <br />
      &nbsp;&nbsp;Motor1: <SwerveMotor motor={swerve.motors[1]}></SwerveMotor>
      <br />
      &nbsp;&nbsp;Motor2: <SwerveMotor motor={swerve.motors[2]}></SwerveMotor>
      <br />
      &gt;NETWORK <br />
      &nbsp;Load: <NwLoad value={network.load}></NwLoad><br />
      &nbsp;&gt;Ping <br />
      {#each app.last_ping as last_ping, i}
        &nbsp;&nbsp;{i}: <LastPing {last_ping}></LastPing> <br />
      {/each}
    </TabContent>
    <TabContent name="Connection">
      <TextInput bind:value={app.url} height="3em" line_height="1em" />
      <span>
        {$sock ? "Connected" : "Not Connected"}
      </span>
      <Button
        height="60px"
        width="120px"
        on:click={() => {
          app.connect();
        }}>Connect</Button
      >
    </TabContent>
    <TabContent name="Calibration" style="height: 100%; width: 100%">
      <TabContainer
        tag="2023-korobo-nc-calib"
        style="height: 100%; width: 100%"
        names={[
          "Steer Motor 0",
          "Steer Motor 1",
          "Steer Motor 2",
          "Steer Gyro",
        ]}
        vertical={true}
        tab_size="1em"
      >
        <TabContent style="width: 100%; height: 100%" name="Steer Motor 0"
          ><CalibPid
            bind:p_gain={app.controls.num["sm0pp"].curr}
            bind:i_gain={app.controls.num["sm0pi"].curr}
            bind:d_gain={app.controls.num["sm0pd"].curr}
          ></CalibPid></TabContent
        >
        <TabContent style="width: 100%; height: 100%" name="Steer Motor 1"
          ><CalibPid
            bind:p_gain={app.controls.num["sm1pp"].curr}
            bind:i_gain={app.controls.num["sm1pi"].curr}
            bind:d_gain={app.controls.num["sm1pd"].curr}
          ></CalibPid></TabContent
        >
        <TabContent style="width: 100%; height: 100%" name="Steer Motor 2"
          ><CalibPid
            bind:p_gain={app.controls.num["sm2pp"].curr}
            bind:i_gain={app.controls.num["sm2pi"].curr}
            bind:d_gain={app.controls.num["sm2pd"].curr}
          ></CalibPid></TabContent
        >
        <TabContent style="width: 100%; height: 100%" name="Steer Gyro"
          ><CalibPid
            bind:p_gain={app.controls.num["sgpp"].curr}
            bind:i_gain={app.controls.num["sgpi"].curr}
            bind:d_gain={app.controls.num["sgpd"].curr}
          ></CalibPid></TabContent
        >
      </TabContainer>
    </TabContent>
  </TabContainer>
</div>

<style>
  div.container {
    height: 100%;
    width: 100%;

    text-shadow: 0px 0px 3px #ccc;
  }
  div.ctrl-logo {
    transform: translate(50%, -50%);
    opacity: 0;
    transition: opacity 0.5s 0.5s;
  }
  div.ctrl-logo.ready {
    opacity: 1;
  }
</style>
