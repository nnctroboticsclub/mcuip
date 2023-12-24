<script lang="ts">
  import Window from "../window/window.svelte";
  import Joystick from "$lib/ui/joystick.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TextInput from "$lib/ui/text_input.svelte";
  import Button from "$lib/ui/button.svelte";
  import { getWindow } from "$lib/window/window";

  const url_store = getWindow().getDataStore<string>("url");

  if (!$url_store) {
    url_store.set("ws://192.168.1.114/robo-ctrl");
  }

  let x0: number, y0: number;
  let x1: number, y1: number;
  let x2: number, y2: number;
</script>

<Window>
  <svelte:fragment slot="title"
    >うおおおおおおおおおお 2023 交ロボ</svelte:fragment
  >
  <svelte:fragment slot="app">
    <TabContainer
      names={["Control", "Connection", "Control"]}
      tag="2023-korobo-nc"
    >
      <TabContent name="Connection">
        <div style="display:flex;">
          <TextInput
            bind:value={$url_store}
            height="2em"
            width="calc(100% - 100px)"
          />
          <Button
            width="100px"
            height="2em"
            on:click={() => {
              console.log("connect");
            }}>Connect</Button
          >
        </div>
      </TabContent>
      <TabContent name="Control">
        <div class="container">
          <Joystick
            radius={200}
            bind:x_val={x0}
            bind:y_val={y0}
            tag="sm"
            stick_name="Steering Move"
          />
          <Joystick
            radius={200}
            bind:x_val={x1}
            bind:y_val={y1}
            tag="sr"
            stick_name="Steering Rotation"
          />
          <Joystick
            radius={200}
            bind:x_val={x2}
            bind:y_val={y2}
            tag="ru"
            stick_name="Rotation Up"
          />
        </div>
      </TabContent>
    </TabContainer>
  </svelte:fragment>
</Window>

<style>
  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
</style>
