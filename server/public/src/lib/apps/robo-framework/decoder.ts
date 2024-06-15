export function decode_gain(byte: number) {
  return (byte / 255) * 10;
}

export function decode_angle(byte: number) {
  return (byte / 255) * 360;
}

export function decode_power(byte: number) {
  return (byte - 128) / 127;
}

export function decode_magnitude(byte: number) {
  return (byte / 255) * 100;
}

export function decode_error(byte: number) {
  return (byte - 128) / 127;
}