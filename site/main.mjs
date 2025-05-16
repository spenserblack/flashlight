const makeKey = (key) => `__FLASHLIGHT-${key}`;
const colorKey = makeKey("COLOR");
const storage = window.localStorage;

const saveItem = (key, value) => {
  storage.setItem(key, JSON.stringify(value));
};
const loadItem = (key, def) => {
  const raw = storage.getItem(key);
  if (raw == null) {
    return def;
  }
  return JSON.parse(raw);
};

const body = document.getElementsByTagName("body")[0];

const nToRgb = (n) => {
  if (n <= 0xFFF) {
    // Short form
    const r = n >> 8;
    const g = (n >> 4) & 0xF;
    const b = n & 0xF;
    return [r, g, b];
  }
  const r = n >> 16;
  const g = (n >> 8) & 0xFF;
  const b = n & 0xFF;
  return [r, g, b];
};

// NOTE We're going to assume that we're always using hex colors.
const parseColor = (raw) => {
  const hex = Number.parseInt(raw.slice(1), 16);
  return nToRgb(hex);
};

const isBright = ([r, g, b]) => {
  // NOTE See https://en.wikipedia.org/wiki/Relative_luminance
  const rw = 0.2126;
  const gw = 0.7152;
  const bw = 0.0722;
  const weights = [[r, rw], [g, gw], [b, bw]];
  const brightness = weights.reduce((brightness, [channel, weight]) => brightness + (channel * weight), 0);
  console.log("brightness", brightness);
  return brightness > 0x80;
};

export const setColor = (color) => {
  body.style.backgroundColor = color;
  const fg = isBright(parseColor(color)) ? "#000" : "#FFF"
  console.log("fg", fg);
  body.style.color = fg;
  saveItem(colorKey, color);
};

export const getCurrentColor = () => loadItem(colorKey, "#888888");

// NOTE #888 is roughly a mid point, where it will be kind of bright but not
//      too extreme for first usage.
setColor(getCurrentColor());
