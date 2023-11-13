import { writable, type Writable } from "svelte/store";

class Theme {
  // app_background_color: Writable<string> = writable('#d2000f');
  // title_bar_color: Writable<string> = writable('#6084b0');
  app_background_color: Writable<string> = writable('#eee');
  title_bar_color: Writable<string> = writable('#fcc');
}


export const theme = new Theme();