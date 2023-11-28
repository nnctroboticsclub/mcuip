import { writable } from "svelte/store";

export const global_state = {
  app_name: writable("McuIP Web Client"),
  config: {
    debug: {
      dragger: {
        visual: writable(false)
      },
      window: {
        hover_enabled: writable(false)
      }
    }
  },
  theme: {
    global_background_color: writable('#eee'),
    title_bar_color: writable('#fcc'),
    app_background_color: writable('#ccc'),
  }
};