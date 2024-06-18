<script>
  import BreadCrumbContext from "./breadcrumb";

  const ctx = BreadCrumbContext.getContext();

  const path = ctx.getPath();
</script>

<div class="container">
  {#each $path as item, i}
    <div class="item">
      <input
        type="button"
        value={item.title}
        class="text"
        class:active={item.indicated}
        aria-current="page"
        on:click={() => {
          ctx.indicate_to(i - $path.length + 1);
        }}
      />

      {#if i !== $path.length - 1}
        <span class="sep">/</span>
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  div.container {
    width: 100%;

    div.item {
      display: inline-block;
      position: relative;

      input[type="button"].text {
        display: inline-block;
        color: #6c757d;

        padding-left: 0.5rem;

        &.active {
          color: #000;
        }
      }

      span.sep {
        display: inline-block;
        padding: 0 0.25rem;
        color: #6c757d;
      }
    }
  }
</style>
