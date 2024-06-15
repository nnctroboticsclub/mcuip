import { writable, type Writable } from "svelte/store";

export let ready = writable(false);


export let network = {
  load: writable(0),
};