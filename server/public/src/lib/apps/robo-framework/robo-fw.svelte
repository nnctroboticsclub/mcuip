<script lang="ts">
  import { onMount } from "svelte";
  import { App } from "./korobo2023nc";

  import { ready } from "./state/status";
  import Topology from "./tabs/topology.svelte";
  import { console_texts } from "$lib/console_patch";
  import TabContainer from "$lib/ui/tab/tab-container.svelte";
  import Hierachy from "./Hierachy.svelte";
  import TabContent from "$lib/ui/tab/tab-content.svelte";
  import BreadcrumbContainer from "$lib/ui/breadcrumb/breadcrumb_container.svelte";
  import BreadcrumbBar from "$lib/ui/breadcrumb/breadcrumb_bar.svelte";

  const app = App.new_instance();
  onMount(() => {
    const interval = setInterval(() => {
      // app.tick();
    }, 50);

    $ready = true;

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="size-full flex flex-row">
  <div class="flex-none w-[200px]">
    <Hierachy />
  </div>

  <div class="vbar" />

  <div class="flex-1">
    <TabContainer
      tag="debugger"
      height="100%"
      tab_size="200px"
      names={["Topology", "Logging"]}
    >
      <TabContent name="Topology">
        <BreadcrumbContainer root={Topology}>
          <BreadcrumbBar />
        </BreadcrumbContainer>
      </TabContent>
      <TabContent name="Logging">Logging</TabContent>
    </TabContainer>
  </div>

  <div class="vbar" />

  <div class="flex-none w-[200px] text-[12px]">
    {#each $console_texts.slice(-25) as line}
      {line.time.toLocaleTimeString()}: {line.text}<br />
    {/each}
  </div>
</div>
