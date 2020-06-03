import { tweened } from 'svelte/motion';
import { cubicOut } from 'svelte/easing';

import { getTop, getHeight } from '../utils/selection.js';

export function smoothSizePos(node, { start, end, duration }) {
  const smooth = tweened({
    startInMs: start - start.startOf('day'),
    endInMs: end - end.startOf('day'),
  }, {
    duration: duration ?? 100,
    easing: cubicOut,
  });
  const unsub = smooth.subscribe(({ startInMs, endInMs }) => {
    node.style.position = 'absolute';
    node.style.top = getTop(startInMs);
    node.style.height = getHeight(endInMs - startInMs);
  });
  return ({
    update({ start, end }) {
      smooth.set({
        startInMs: start - start.startOf('day'),
        endInMs: end - end.startOf('day')
      });
    },
    destroy() {
      unsub();
    }
  })
}

export function sizePos(node, { start, end }) {
  node.style.position = 'absolute';
  node.style.top = getTop(start - start.startOf('day'));
  node.style.height = getHeight(end - start);
  return ({
    update({ start, end }) {
      node.style.top = getTop(start - start.startOf('day'));
      node.style.height = getHeight(end - start);
    }
  });
}