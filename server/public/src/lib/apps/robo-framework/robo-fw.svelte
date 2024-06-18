<script lang="ts">
  import { onMount } from "svelte";
  import { App } from "./korobo2023nc";

  import { ready } from "./state/status";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import Topology from "./tabs/topology.svelte";
  import BreadcrumbContainer from "$lib/ui/breadcrumb/breadcrumb_container.svelte";
  import BreadcrumbBar from "$lib/ui/breadcrumb/breadcrumb_bar.svelte";
  import { console_texts } from "$lib/console_patch";
  import FEPClient from "./fep_client";
  import { get } from "svelte/store";

  const app = App.new_instance();
  onMount(() => {
    const interval = setInterval(() => {
      app.tick();
    }, 50);

    $ready = true;

    setTimeout(async () => {
      fep.server_uri.set("ws://localhost:8100");
      await fep.connect();

      const sock = get(fep.sock);
      sock?.send(new Uint8Array([0x02, 0x08, 0x55, 0xaa, 0xcc]));
    }, 200);

    return () => {
      clearInterval(interval);
    };
  });

  const fep = FEPClient.createInstance();
</script>

<div class="container">
  <div class="debugger">
    <TabContainer tag="debugger" height="100%" names={["Topology", "Logging"]}>
      <TabContent name="Topology">
        <BreadcrumbContainer root={Topology}>
          <BreadcrumbBar />
        </BreadcrumbContainer>
      </TabContent>
      <TabContent name="Logging">Logging</TabContent>
    </TabContainer>
  </div>
  <div class="vbar" />
  <div class="logging">
    {#each $console_texts.slice(-25) as line}
      {line.time.toLocaleTimeString()}: {line.text}<br />
    {/each}
  </div>
</div>

<style lang="scss">
  .vbar {
    width: 1px;
    height: calc(100% - 10px);
    background-color: #ccc;

    margin: 0 10px;
    padding: 5px 0;

    transform: translateY(5px);
  }

  .hbar {
    width: 100%;
    height: 1px;
    background-color: #ccc;

    margin: 10px 0;
  }

  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .debugger {
      flex: 1;
    }

    .logging {
      flex: 0 0 200px;
      font-size: 12px;
    }
  }
</style>
