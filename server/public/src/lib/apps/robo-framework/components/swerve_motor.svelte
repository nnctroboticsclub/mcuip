<script lang="ts">
  import type { Writable } from "svelte/store";

  export let motor: {
    drive: Writable<number>;
    rot: Writable<number>;
  };

  let drive = motor.drive;
  let rot = motor.rot;
</script>

d{("   " + $drive.toFixed(2)).slice(-5)} r{("   " + $rot.toFixed(2)).slice(-5)}
