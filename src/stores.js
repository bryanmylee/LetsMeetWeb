import { writable, derived } from 'svelte/store';
import chroma from 'chroma-js';
import jwt from 'jsonwebtoken';

/**
 * Create a user store which can only be updated by setting an access token.
 */
function getUser() {
  const user = writable({
    isLoggedIn: false,
    accessToken: null,
    eventUrl: null,
    username: null,
    isAdmin: false,
  });

  const setAccessToken = (accessToken, secret) => {
    if (accessToken == null || secret == null) return;
    try {
      const { evt, uid, adm } = jwt.verify(accessToken, secret);
      user.set({
        accessToken,
        eventUrl: evt,
        username: uid,
        isAdmin: adm,
        isLoggedIn: true,
      });
    } catch (err) {
      throw new Error('Access token invalid');
    }
  };

  const logout = () => {
    user.set({
      isLoggedIn: false,
    });
  };

  return {
    subscribe: user.subscribe,
    setAccessToken,
    logout,
  };
}
export const user = getUser();

export const colors = {
  blue500: { tint: 500, hex: '#2196F3', name: 'Blue' },
  cyan500: { tint: 500, hex: '#00BCD4', name: 'Cyan' },
  teal500: { tint: 500, hex: '#009688', name: 'Teal' },
  green500: { tint: 500, hex: '#4CAF50', name: 'Green' },
  amber500: { tint: 500, hex: '#FFC107', name: 'Amber' },
  orange500: { tint: 500, hex: '#FF9800', name: 'Orange' },
  red500: { tint: 500, hex: '#F44336', name: 'Red' },
  pink300: { tint: 300, hex: '#F06292', name: 'Pink' },
  purple500: { tint: 500, hex: '#9C27B0', name: 'Purple' },
  deepPurple500: { tint: 500, hex: '#673AB7', name: 'Deep Purple' },
  indigo500: { tint: 500, hex: '#3F51B5', name: 'Indigo' },
  blueGrey500: { tint: 500, hex: '#607D8B', name: 'Blue Grey' },
};

function hexToScale(baseHex) {
  const base = chroma(baseHex);
  const light = base.brighten(1.8).desaturate();
  const dark = base.darken(1.8);
  return chroma.scale([light, base, dark]).mode('lrgb');
}

const currentBaseColor = writable(colors.blue500);

const colorScale = derived(currentBaseColor, ({ hex }) => hexToScale(hex));

const gradientDark = derived(currentBaseColor, ({ hex }) => {
  const base = chroma(hex);
  return base.darken(0.8).saturate().hex();
});

const getTint = derived(currentBaseColor, ({ hex }) => {
  const tintScale = chroma.scale(['#FFF', hex, '#000'])
    .domain([0, 1000])
    .mode('lab');
  return (tint) => tintScale(tint);
});

const color = derived(
  [currentBaseColor, colorScale, gradientDark, getTint],
  ([$currentBaseColor, $colorScale, $gradientDark, $getTint]) => ({
    ...$currentBaseColor,
    gradientDark: $gradientDark,
    scale: $colorScale,
    getTint: $getTint,
  }),
);

let colorIndex = 0;
export const currentColor = {
  subscribe: color.subscribe,
  setBaseColor: (newColor) => currentBaseColor.set(newColor),
  setBaseColorHex: (newHex) => currentBaseColor.set({ tint: 500, hex: newHex, name: '' }),
  nextColor: () => {
    currentBaseColor.set(
      Object.values(colors)[++colorIndex % Object.keys(colors).length],
    );
  },
};

export const layoutEnum = {
  NARROW: 'NARROW',
  WIDE: 'WIDE',
};
export const layout = writable(layoutEnum.NARROW);
