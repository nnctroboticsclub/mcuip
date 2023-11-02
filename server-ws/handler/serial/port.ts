export class SerialPort {
  rx_callbacks: ((data: { [key: string]: any }) => void)[];
  tx_callbacks: ((data: { [key: string]: any }) => void)[];

  constructor(private port_name: string) {
    this.rx_callbacks = [];
    this.tx_callbacks = [];
  }

  get name() {
    return this.port_name;
  }

  rx(data: { [key: string]: any }) {
    this.rx_callbacks.forEach(cb => cb(data));
  }

  tx(data: { [key: string]: any }) {
    this.tx_callbacks.forEach(cb => cb(data));
  }

  add_rx_callback(cb: (data: { [key: string]: any }) => void) {
    this.rx_callbacks.push(cb);
  }

  add_tx_callback(cb: (data: { [key: string]: any }) => void) {
    this.tx_callbacks.push(cb);
  }

  debug() {
    this.add_rx_callback(data => console.log(`[${this.port_name}] RX: ${data}`));
    this.add_tx_callback(data => console.log(`[${this.port_name}] TX: ${data}`));
  }
}