<script lang="ts">
  import { getWindow } from "$lib/window/window";
  import Window from "../window/window.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TextInput from "$lib/ui/text_input.svelte";
  import Button from "$lib/ui/button.svelte";
  import { get } from "svelte/store";

  const ip_address = getWindow().getDataStore<string>("ip");
  if (!$ip_address) {
    ip_address.set("");
  }

  function connect() {
    console.log(`Connecting to ${get(ip_address)}`);
  }
</script>

<Window>
  <svelte:fragment slot="title">McuIp Controller</svelte:fragment>
  <svelte:fragment slot="app">
    <TabContainer names={["Connection", "Device status"]} tag="main-tab">
      <TabContent name="Connection">
        <div class="action-bar">
          <TextInput bind:value={$ip_address} width="calc(100% - 150px)" />
          <Button on:click={() => connect()} width="140px" height="100%"
            >Connect</Button
          >
        </div>
      </TabContent>
      <TabContent name="Device status"></TabContent>
    </TabContainer>
  </svelte:fragment>
</Window>

<style>
  div.action-bar {
    display: flex;
    height: 2em;
  }
</style>
