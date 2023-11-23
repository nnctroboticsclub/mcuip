import { writable } from "svelte/store";

export { theme } from "./theme";


export const global_state = {
  app_name: writable("McuIP Web Client"),
  config: {
    debug: {
      dragger: {
        visual: writable(false)
      }
    }
  }
};