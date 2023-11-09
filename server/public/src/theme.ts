import { writable, type Writable } from "svelte/store";

class Theme {
  app_background: Writable<string> = writable('#d2000f');
}


export const theme = new Theme();