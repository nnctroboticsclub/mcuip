import { writable } from "svelte/store";

export const console_texts = writable<{ text: string, time: Date }[]>([]);

function stringify(obj: object) {
  if (typeof obj === "string") {
    return obj;
  }

  return JSON.stringify(obj);
}

export function patch_console_log() {
  if (Object.hasOwn(console, "__patched")) {
    return;
  }

  // @ts-ignore
  console["__patched"] = true;

  const targets = [
    "log",
    "info",
    "error",
    "warn"
  ];

  type targetTypes =
    "log" |
    "info" |
    "error" |
    "warn";

  for (let target of targets) {
    let original_function = console[target as targetTypes];
    console[target as targetTypes] = (...data) => {
      original_function(...data);

      let logging_string = data.map(stringify).join(" ");
      console_texts.update(texts => {
        const now = new Date();
        texts.push({
          text: logging_string,
          time: now
        });
        return texts;
      });
    }
  }
}