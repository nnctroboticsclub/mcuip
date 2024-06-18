<script lang="ts">
  import BreadCrumbContext from "$lib/ui/breadcrumb/breadcrumb";
  import type { Topo } from "./topology";

  export let node: Topo;

  const name = node.data.name;
  const wake_time = node.data.wake_time;
  const fep_addr = node.data.fep_addr;
</script>

<div class="container">
  <div class="info">
    Wake Time: {$wake_time}<br />
    FEP Addr: {$fep_addr}<br />
  </div>

  <span class="btn">Node Inspect</span>
  <span class="btn">Config</span>
  <span class="btn">Controller</span>
</div>

<style lang="scss">
  div.container {
    margin: 20px;
    position: relative;
    margin-top: 20px;

    div.info {
      margin-bottom: 30px;
      transform: translateX(20px);

      &::before {
        content: "Information";
        display: block;
        transform: translateX(-20px);
      }
    }

    span.btn {
      display: block;
      margin-top: 0;
      margin-bottom: 20px;
      height: 50px;
      padding: 10px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 5px;
      text-align: center;
      transition: background-color 0.3s;

      &:hover {
        background-color: #ddd;
      }
    }
  }
</style>
