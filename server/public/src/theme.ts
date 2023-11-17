import { writable, type Writable } from "svelte/store";

class Theme {
  // app_background_color: Writable<string> = writable('#d2000f');
  // title_bar_color: Writable<string> = writable('#6084b0');
  global_background_color: Writable<string> = writable('#eee');
  title_bar_color: Writable<string> = writable('#fcc');
  app_background_color: Writable<string> = writable('#ccc');
}


export const theme = new Theme();

setTimeout(() => {
  theme.global_background_color.set('#eef');
  theme.title_bar_color.set('#efe');
  theme.app_background_color.set('#ddf');
}, 2000);