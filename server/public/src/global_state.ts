import { writable } from "svelte/store";

export const global_state = {
  app_name: writable("McuIP Web Client"),
  app_bar_show: writable(false),
  config: {
    debug: {
      dragger: {
        visual: writable(false)
      },
    },
    window: {
      hover_enabled: writable(false),
      centered_title_bar: writable(true),
      title_bar_with_z_index: writable(false),
    }
  },
  theme: {
    window: {
      background_color: writable('#ccc')
    },
    framework: {
      background_color: writable('#eee'),
      appbar_color: writable('#fcc'),
    }
  }
};