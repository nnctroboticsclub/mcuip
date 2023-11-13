let patched = false;

let subscribers: ((text: string) => void)[] = [];

function stringify(obj: object) {
  if (typeof obj === "string") {
    return obj;
  }

  return JSON.stringify(obj);
}

export function subscribe_console_log(func: (text: string) => void) {
  subscribers.push(func);

  return () => {
    subscribers = subscribers.filter((f) => f !== func);
  };
}

export function patch_console_log() {
  if (patched) {
    console.warn('W: console logging functions are already patched');
  }

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
      subscribers.forEach((func) => func(logging_string));

    }

  }

}