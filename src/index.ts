import Trail from './Trail';

import 'sanitize.css';

import './index.scss';

const MIN_DISTANCE = 20;
const MAX_DISTANCE = 50;
const END_DISTANCE = 100;

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
  const e = createSvgElement('text', {
    'text-anchor': 'middle',
    'alignment-baseline': 'middle',
    ...attributes,
  });
  e.textContent = text;
  return e;
};

const closestEdge = ({ x, y }: { x: number; y: number }) => {
  const right = svg.clientWidth - x;
  const bottom = svg.clientHeight - y;
  const distance = Math.min(x, y, right, bottom);
  const angle =
    distance === x ? 0 : distance === y ? 90 : distance === right ? 180 : 270;
  return { angle, distance };
};

const onMouseMove = ({ offsetX: x, offsetY: y }: MouseEvent) => {
  const point = { x, y };

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

  if (distance < MIN_DISTANCE) return;

  const edge = closestEdge(point);

  if (distance > MAX_DISTANCE) {
    trails.push(new Trail(point));
    svg.appendChild(
      createText('G', {
        transform: `rotate(${edge.angle}, ${point.x}, ${point.y})`,
        fill: '#4285F4',
        ...point,
      })
    );
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
