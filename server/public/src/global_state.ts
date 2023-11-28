import { writable } from "svelte/store";

export const global_state = {
  app_name: writable("McuIP Web Client"),
  config: {
    debug: {
      dragger: {
        visual: writable(false)
      },
    },
    window: {
      hover_enabled: writable(false),
      centered_title_bar: writable(true),
    }
  },
  theme: {
    window: {
      background_color: writable('#ccc')
    },
    app: {
      background_color: writable('#eee'),
      appbar_color: writable('#fcc'),
    }
  }
};