import { writable, type Writable } from "svelte/store";

class Theme {
  app_background_color: Writable<string> = writable('#d2000f');
  title_bar_color: Writable<string> = writable('#6084b0');
}


export const theme = new Theme();