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
  import CalibNum from "./calib-num.svelte";
  import CalibLr from "./calib-LR.svelte";

  let ready = false;
  let vector_configure_mode = false;

  let rotation_mode;

  let swerve: {
    motors: {
      rot: Writable<number>;
      drive: Writable<number>;
      error: Writable<number>;
      p_gain: Writable<number>;
      i_gain: Writable<number>;
      d_gain: Writable<number>;
      rot_fb: Writable<number>;
      rot_out: Writable<number>;
    }[];
    gyro: Writable<number>;
    angle_error: Writable<number>;
  } = {
    motors: [
      {
        rot: writable(0),
        drive: writable(0),
        error: writable(0),
        p_gain: writable(0),
        i_gain: writable(0),
        d_gain: writable(0),
        rot_fb: writable(0),
        rot_out: writable(0),
      },
      {
        rot: writable(0),
        drive: writable(0),
        error: writable(0),
        p_gain: writable(0),
        i_gain: writable(0),
        d_gain: writable(0),
        rot_fb: writable(0),
        rot_out: writable(0),
      },
      {
        rot: writable(0),
        drive: writable(0),
        error: writable(0),
        p_gain: writable(0),
        i_gain: writable(0),
        d_gain: writable(0),
        rot_fb: writable(0),
        rot_out: writable(0),
      },
    ],
    gyro: writable(0),
    angle_error: writable(0),
  };

  let mdc_status = [
    [
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
    ],
    [
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
    ],
    [
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
      {
        speed: writable(0),
        encoder: writable(0),
      },
    ],
  ];
  let esc_status = [writable(0), writable(0), writable(0)];

  let network = {
    load: writable(0),
  };

  const app = App.new_instance();
  const sock = app.sock;
  onMount(() => {
    const interval = setInterval(() => {
      app.tick();
    }, 50);

    ready = true;

    return () => {
      clearInterval(interval);
    };
  });

  function decode_gain(byte: number) {
    return (byte / 255) * 10;
  }

  function decode_angle(byte: number) {
    return (byte / 255) * 360;
  }

  function decode_power(byte: number) {
    return (byte - 128) / 127;
  }

  function decode_magnitude(byte: number) {
    return (byte / 255) * 100;
  }

  function decode_error(byte: number) {
    return (byte - 128) / 127;
  }

  app.on_data(0x00, (v) => {
    swerve.motors[0].drive.set(decode_magnitude(v.getUint8(0)));
    swerve.motors[0].rot.set(decode_angle(v.getUint8(1)));
    swerve.motors[1].drive.set(decode_magnitude(v.getUint8(2)));
    swerve.motors[1].rot.set(decode_angle(v.getUint8(3)));
    swerve.motors[2].drive.set(decode_magnitude(v.getUint8(4)));
    swerve.motors[2].rot.set(decode_angle(v.getUint8(5)));
    swerve.gyro.set(decode_angle(v.getUint8(6)));
  });
  app.on_data(0x01, (v) => {
    swerve.motors[0].error.set(decode_error(v.getUint8(0)));
    swerve.motors[1].error.set(decode_error(v.getUint8(1)));
    swerve.motors[2].error.set(decode_error(v.getUint8(2)));

    swerve.angle_error.set(decode_error(v.getUint8(3)));
  });

  app.on_data(0x20, (v) => {
    swerve.motors[0].p_gain.set(decode_gain(v.getUint8(0)));
    swerve.motors[0].i_gain.set(decode_gain(v.getUint8(1)));
    swerve.motors[0].d_gain.set(decode_gain(v.getUint8(2)));
    swerve.motors[0].rot_fb.set(decode_angle(v.getUint8(3)));
    swerve.motors[0].rot_out.set(decode_power(v.getUint8(4)));
  });
  app.on_data(0x21, (v) => {
    swerve.motors[1].p_gain.set(decode_gain(v.getUint8(0)));
    swerve.motors[1].i_gain.set(decode_gain(v.getUint8(1)));
    swerve.motors[1].d_gain.set(decode_gain(v.getUint8(2)));
    swerve.motors[1].rot_fb.set(decode_angle(v.getUint8(3)));
    swerve.motors[1].rot_out.set(decode_power(v.getUint8(4)));
  });
  app.on_data(0x22, (v) => {
    swerve.motors[2].p_gain.set(decode_gain(v.getUint8(0)));
    swerve.motors[2].i_gain.set(decode_gain(v.getUint8(1)));
    swerve.motors[2].d_gain.set(decode_gain(v.getUint8(2)));
    swerve.motors[2].rot_fb.set(decode_angle(v.getUint8(3)));
    swerve.motors[2].rot_out.set(decode_power(v.getUint8(4)));
  });
  app.on_data(0x30, (v) => {
    mdc_status[0][0].speed.set(decode_power(v.getUint8(0)));
    mdc_status[0][1].speed.set(decode_power(v.getUint8(1)));
    mdc_status[0][2].speed.set(decode_power(v.getUint8(2)));
    mdc_status[0][3].speed.set(decode_power(v.getUint8(3)));
  });
  app.on_data(0x31, (v) => {
    mdc_status[1][0].speed.set(decode_power(v.getUint8(0)));
    mdc_status[1][1].speed.set(decode_power(v.getUint8(1)));
    mdc_status[1][2].speed.set(decode_power(v.getUint8(2)));
    mdc_status[1][3].speed.set(decode_power(v.getUint8(3)));
  });
  app.on_data(0x32, (v) => {
    mdc_status[2][0].speed.set(decode_power(v.getUint8(0)));
    mdc_status[2][1].speed.set(decode_power(v.getUint8(1)));
    mdc_status[2][2].speed.set(decode_power(v.getUint8(2)));
    mdc_status[2][3].speed.set(decode_power(v.getUint8(3)));
  });
  app.on_data(0x50, (v) => {
    mdc_status[0][0].encoder.set(decode_angle(v.getUint8(0)));
    mdc_status[0][1].encoder.set(decode_angle(v.getUint8(1)));
    mdc_status[0][2].encoder.set(decode_angle(v.getUint8(2)));
    mdc_status[0][3].encoder.set(decode_angle(v.getUint8(3)));
  });
  app.on_data(0x51, (v) => {
    mdc_status[1][0].encoder.set(decode_angle(v.getUint8(0)));
    mdc_status[1][1].encoder.set(decode_angle(v.getUint8(1)));
    mdc_status[1][2].encoder.set(decode_angle(v.getUint8(2)));
    mdc_status[1][3].encoder.set(decode_angle(v.getUint8(3)));
  });
  app.on_data(0x52, (v) => {
    mdc_status[2][0].encoder.set(decode_angle(v.getUint8(0)));
    mdc_status[2][1].encoder.set(decode_angle(v.getUint8(1)));
    mdc_status[2][2].encoder.set(decode_angle(v.getUint8(2)));
    mdc_status[2][3].encoder.set(decode_angle(v.getUint8(3)));
  });
  app.on_data(0x38, (v) => {
    esc_status[0].set(decode_power(v.getUint8(0)));
    esc_status[1].set(decode_power(v.getUint8(1)));
    esc_status[2].set(decode_power(v.getUint8(2)));
  });
  app.on_data(0xfe, (v) => {
    const load = (v.getUint32(0, false) / 0x100000000) * 10000;
    network.load.set(load);
  });
</script>

<div class="container">
  <div
        style="position: absolute; top: 50%; right: 50%;"
        class="ctrl-logo"
        class:ready
      >
        <img src={SrAbe2} width="230px" alt="logo" />
      </div>
  <div class="status-wrapper">
    <div class="status">
      Status <br />
      <span style="background-color: #{$sock ? '00ff' : 'ff00'}0044;"
        >&nbsp;&nbsp;</span
      >&nbsp;ESP32 Relay<br />
      &gt;NETWORK <br />
      &nbsp;Load: <NwLoad value={network.load}></NwLoad><br />
      &nbsp;&gt;Ping <br />
      {#each app.devices as device, i}
        &nbsp;&nbsp;{i}: <LastPing {device}></LastPing> <br />
      {/each}
    </div>
  </div>
  <TabContainer
    style="flex-grow: 1; display: flexbox; position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"
    names={["Control", "Connection", "Calibration", "Vector", "Debugging"]}
    tag="2023-korobo-nc"
  >
    <TabContent
      name="Control"
      style="position: relative; height: 100%; width: 100%; flex: 1 1 auto;"
    >

      <Joystick
        radius={200}
        bind:x_val={app.controls.num["smx"].curr}
        bind:y_val={app.controls.num["smy"].curr}
        tag="sm"
        stick_name="Move"
        style="position: absolute; bottom: 0; left: 0;"
      />
      <Joystick
        radius={200}
        bind:x_val={app.controls.num["lha"].curr}
        bind:y_val={app.controls.num["lva"].curr}
        tag="la"
        stick_name="Launch"
        style="position: absolute; bottom: 0; right: 0;"
      />
      <Button
        style="position: absolute; top: 70px; left: 6.5cm; border: 1px solid {app
          .controls.bool['sht'].curr
          ? 'red'
          : 'blue'};"
        color="transparent"
        active_color="#00f1"
        width="70px"
        height="70px"
        on:click={() => {
          app.controls.bool["sht"].curr = !app.controls.bool["sht"].curr;
        }}
      >
        Shot
      </Button>
      <Button
        style="position: absolute; top: 0; left: 4.5cm; border: 1px solid {app
          .controls.bool['urc'].curr
          ? 'red'
          : 'blue'};"
        color="transparent"
        active_color="#00f1"
        width="70px"
        height="70px"
        on:click={() => {
          app.controls.bool["urc"].curr = !app.controls.bool["urc"].curr;
        }}
      >
        Revol
      </Button>

      <Button
        style="position: absolute; top: 0; right: 2.5cm; border: 1px solid blue;"
        color="transparent"
        active_color="#00f1"
        width="70px"
        height="70px"
        on:click={() => {
          app.controls.bool["srr"].curr = !app.controls.bool["srr"].curr;
        }}
      >
        --&gt;
      </Button>
      <Button
        style="position: absolute; top: 0; left: 2.5cm; border: 1px solid blue;"
        color="transparent"
        active_color="#00f1"
        width="70px"
        height="70px"
        on:click={() => {
          app.controls.bool["srl"].curr = !app.controls.bool["srl"].curr;
        }}
      >
        &lt;--
      </Button>

      <Button
        style="position: absolute; top: 0px; right: 4.5cm; border: 1px solid {app
          .controls.bool['lod'].curr
          ? 'red'
          : 'blue'};"
        color="transparent"
        active_color="#00f1"
        width="70px"
        height="70px"
        on:click={() => {
          app.controls.bool["lod"].curr = !app.controls.bool["lod"].curr;
        }}
      >
        Load
      </Button>
      <Button
        style="position: absolute; top: 70px; right: 6.5cm; border: 1px solid {app
          .controls.bool['emc'].curr
          ? 'red'
          : 'blue'};"
        color="transparent"
        active_color="#00f1"
        width="70px"
        height="70px"
        on:click={() => {
          app.controls.bool["emc"].curr = !app.controls.bool["emc"].curr;
        }}
      >
        Soft EMC
      </Button>
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
      <div
        style="position: relative; height: 100%; width: 100%; flex 1 1 auto;"
      >
        <Button
          style="position: absolute; top: 0px; left: 0px; border: 1px solid {vector_configure_mode
            ? 'red'
            : 'blue'};"
          color="transparent"
          active_color="#00f1"
          width="70px"
          height="70px"
          on:click={() => {
            vector_configure_mode = !vector_configure_mode;
          }}
        >
          Config
        </Button>

        <div
          style="position: relative; margin: 0 auto; width: 200px; top: 80px;"
        >
          <div style="position: absolute; top: 0px; left: 100px;">
            <Vector
              motor_inverse_key="s0i"
              configure_mode={vector_configure_mode}
              motor={swerve.motors[0]}
            ></Vector>
          </div>

          <div
            style="position: absolute; top: calc(200px * 0.8660254); left: 200px;"
          >
            <Vector
              motor_inverse_key="s1i"
              configure_mode={vector_configure_mode}
              motor={swerve.motors[1]}
            ></Vector>
          </div>

          <div
            style="position: absolute; top: calc(200px * 0.8660254); left: 0px;"
          >
            <Vector
              motor_inverse_key="s2i"
              configure_mode={vector_configure_mode}
              motor={swerve.motors[2]}
            ></Vector>
          </div>
        </div>
      </div>
    </TabContent>
    <TabContent name="Debugging" style="font-size: smaller;">
      <TabContainer
        tag="2023-korobo-nc-debug"
        style="height: 100%; width: 100%"
        names={["Actions", "Analysis", "Packet status", "MDC"]}
        vertical={true}
        deactivate_node={true}
        tab_size="1em"
      >
        <TabContent style="width: 100%; height: 100%" name="Actions">
          <Button
            style="border: 1px solid blue;"
            color="transparent"
            active_color="#00f1"
            width="200px"
            height="50px"
            on:click={() => {
              document.documentElement.requestFullscreen();
            }}
          >
            Request fullscreen
          </Button>
        </TabContent>
        <TabContent style="width: 100%; height: 100%" name="Analysis">
          &gt;PHYSICAL <br />
          &nbsp;&gt;SWERVE <br />
          &nbsp;&nbsp;Robot Angle Errors: <PidError
            val={swerve.angle_error}
          /><br />
          &nbsp;&nbsp;Angle Errors: [<PidError val={swerve.motors[0].error} />, <PidError
            val={swerve.motors[1].error}
          />, <PidError val={swerve.motors[2].error} />] <br />
          &nbsp;&nbsp;Motor0: <SwerveMotor motor={swerve.motors[0]}
          ></SwerveMotor>
          <br />
          &nbsp;&nbsp;Motor1: <SwerveMotor motor={swerve.motors[1]}
          ></SwerveMotor>
          <br />
          &nbsp;&nbsp;Motor2: <SwerveMotor motor={swerve.motors[2]}
          ></SwerveMotor>
        </TabContent>
        <TabContent
          style="width: 100%; height: 100%; display: flex; flex-direction: row;"
          name="Packet status"
        >
          <div style="flex: 1 1 auto; overflow-y: scroll; height: 100%;">
            {#each Object.keys(app.controls.num) as key}
              {@html key.padStart(5, "@").replaceAll("@", "&nbsp;")}: {app.controls.num[
                key
              ].prev.toFixed(5)} =&gt;
              {app.controls.num[key].curr.toFixed(5)} (in
              {app.controls.num[key].range})<br />
            {/each}
            {#each Object.keys(app.controls.bool) as key}
              {@html key.padStart(5, "@").replaceAll("@", "&nbsp;")}: {app
                .controls.bool[key].prev} =&gt;
              {app.controls.bool[key].curr}<br />
            {/each}

            &lt;&lt;== End of controller status ==&gt;&gt;
          </div>
          <div style="flex: 1 1 auto; overflow-y: scroll; height: 100%;">
            {#each app.packet_types as pkt}
              {pkt.id}:{pkt.type}/{pkt.subtype} &lt;-- {pkt.target}
              (counter: {pkt.counter})
              <br />
            {/each}

            &lt;&lt;== End of Packet status ==&gt;&gt;
          </div>
        </TabContent>
        <TabContent
          style="width: 100%; height: 100%; display: flex; flex-direction: row; font-size: 1.25em;"
          name="MDC"
        >
          {#each mdc_status as mdc, i}
            {#each mdc as m, j}
              MDC{i} --&gt; {j}: <RawValue val={m.speed}></RawValue>, enc=<RawValue
                val={m.encoder}
              ></RawValue>
              <br />
            {/each}
          {/each}
          {#each esc_status as m, j}
            ESC &nbsp;--&gt; {j}: <RawValue val={m}></RawValue>
            <br />
          {/each}
        </TabContent>
      </TabContainer>
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
        names={["Swerve", "- Steer Motor", "- Drive Motor", "Upper"]}
      >
        <TabContent style="width: 100%; height: 100%" name="Swerve">
          <TabContainer
            tag="2023-korobo-nc-calib-page1"
            style="height: 100%; width: 100%"
            names={["Steer Gyro"]}
            vertical={true}
            tab_size="1em"
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
        <TabContent style="width: 100%; height: 100%" name="- Steer Motor">
          <TabContainer
            tag="2023-korobo-nc-calib-page2"
            style="height: 100%; width: 100%"
            names={["Steer Motor 0", "Steer Motor 1", "Steer Motor 2"]}
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
            <TabContent style="width: 100%; height: 100%" name="Steer Motor 2"
              ><CalibPid
                bind:p_gain={app.controls.num["sm2pp"].curr}
                bind:i_gain={app.controls.num["sm2pi"].curr}
                bind:d_gain={app.controls.num["sm2pd"].curr}
              ></CalibPid></TabContent
            >
          </TabContainer>
        </TabContent>
        <TabContent style="width: 100%; height: 100%" name="- Drive Motor">
          <TabContainer
            tag="2023-korobo-nc-calib-page3"
            style="height: 100%; width: 100%"
            names={["Steer Drive 0", "Steer Drive 1", "Steer Drive 2"]}
            vertical={true}
            tab_size="1em"
          >
            <TabContent style="width: 100%; height: 100%" name="Steer Drive 0">
              <CalibNum bind:value={app.controls.num["sm0d"].curr} />
            </TabContent>
            <TabContent style="width: 100%; height: 100%" name="Steer Drive 1">
              <CalibNum bind:value={app.controls.num["sm1d"].curr} />
            </TabContent>
            <TabContent style="width: 100%; height: 100%" name="Steer Drive 2">
              <CalibNum bind:value={app.controls.num["sm2d"].curr} />
            </TabContent>
          </TabContainer>
        </TabContent>
        <TabContent style="width: 100%; height: 100%" name="Upper">
          <TabContainer
            tag="2023-korobo-nc-calib-page4"
            style="height: 100%; width: 100%"
            names={[
              "Shot speed",
              "Max Elevation",
              "Rotation Power",
              "Elevation Power",
            ]}
            vertical={true}
            tab_size="1em"
          >
            <TabContent style="width: 100%; height: 100%" name="Shot speed">
              <CalibLr
                bind:global_factor={app.controls.num["msp"].curr}
                bind:l_factor={app.controls.num["msl"].curr}
                bind:r_factor={app.controls.num["msr"].curr}
              ></CalibLr>
            </TabContent>
            <TabContent style="width: 100%; height: 100%" name="Max Elevation">
              <CalibNum bind:value={app.controls.num["mea"].curr}></CalibNum>
            </TabContent>
            <TabContent style="width: 100%; height: 100%" name="Rotation Power">
              <CalibNum bind:value={app.controls.num["urf"].curr}></CalibNum>
            </TabContent>
            <TabContent
              style="width: 100%; height: 100%"
              name="Elevation Power"
            >
              <CalibNum bind:value={app.controls.num["uef"].curr}></CalibNum>
            </TabContent>
            <TabContent style="width: 100%; height: 100%" name="Revolver PID">
              <CalibPid
                bind:p_gain={app.controls.num["urep"].curr}
                bind:i_gain={app.controls.num["urei"].curr}
                bind:d_gain={app.controls.num["ured"].curr}
              ></CalibPid>
            </TabContent>
          </TabContainer>
        </TabContent>
      </TabContainer>
    </TabContent>
  </TabContainer>
</div>

<style lang="scss">
  div.container {
    height: 100%;
    width: 100%;

    text-shadow: 0px 0px 3px #ccc;

    div.status-wrapper {
      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;
      height: 100%;
      width: fit-content;

      position: relative;
      left: 10px;

      div.status {
        background-color: #4442;
        border-radius: 10px;

        font-size: 0.8em;
      }
    }
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
