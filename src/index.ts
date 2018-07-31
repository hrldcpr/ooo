import Trail from './Trail';

import 'sanitize.css';

import './index.scss';

const MIN_DISTANCE = 10;
const MAX_DISTANCE = 50;

const svg = document.getElementById('floor')!;
const trails: Trail[] = [];

const createSvgElement = (tag: string, attributes: any) => {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attributes) {
    e.setAttribute(k, attributes[k]);
  }
  return e;
};

const createText = (text: string, attributes: any) => {
  const e = createSvgElement('text', attributes);
  e.textContent = text;
  return e;
};

const onMouseMove = ({ offsetX: x, offsetY: y }: MouseEvent) => {
  const point = { x, y };

  if (trails.some(trail => trail.distance(point) < MIN_DISTANCE)) return;

  const { trail, distance } = trails.reduce<{
    trail?: Trail;
    distance: number;
  }>(
    (min, trail) => {
      const distance = trail.tailDistance(point);
      return distance < min.distance ? { trail, distance } : min;
    },
    { distance: Infinity }
  );

  if (distance > MAX_DISTANCE) {
    trails.push(new Trail(point));
    svg.appendChild(createText('G', { fill: '#4285F4', ...point }));
  } else {
    trail!.add(point);
    svg.appendChild(
      createText('o', {
        fill: trail!.size() % 2 ? '#FBBC05' : '#EA4335',
        ...point,
      })
    );
  }
};

svg.addEventListener('mousemove', onMouseMove);
