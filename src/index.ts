import Trail from './Trail';

import 'sanitize.css';

import './index.scss';

const MIN_DISTANCE = 40;
const GLE_DISTANCE = 40;
const MAX_DISTANCE = 80;
const END_DISTANCE = 100;

const BLUE = '#4285F4';
const RED = '#EA4335';
const YELLOW = '#FBBC05';
const GREEN = '#34A852';

const svg = document.getElementById('floor')!;
const trails: Trail[] = [];

const createSvgElement = (tag: string, attributes?: any) => {
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

const createG = ({ x, y }: { x: number; y: number }, angle: number) =>
  createText('G', {
    transform: `rotate(${(angle * 180) / Math.PI}, ${x}, ${y})`,
    fill: BLUE,
    x,
    y,
  });

const createO = ({ x, y }: { x: number; y: number }, parity: boolean) =>
  createText('o', {
    fill: parity ? RED : YELLOW,
    x,
    y,
  });

const createGle = (point: { x: number; y: number }, angle: number) => {
  const g = createSvgElement('g');
  g.classList.add('gle');
  g.appendChild(createText('g', { fill: BLUE }));
  g.appendChild(createText('l', { fill: GREEN, x: GLE_DISTANCE }));
  g.appendChild(createText('e', { fill: RED, x: 2 * GLE_DISTANCE }));
  moveGle(g, point, angle);
  return g;
};

const moveGle = (
  gle: SVGElement,
  { x, y }: { x: number; y: number },
  angle: number
) => {
  gle.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad) translate(${GLE_DISTANCE}px, 0px)`;
};

const closestEdge = ({ x, y }: { x: number; y: number }) => {
  const right = svg.clientWidth - x;
  const bottom = svg.clientHeight - y;
  const distance = Math.min(x, y, right, bottom);
  const angle =
    distance === x
      ? 0
      : distance === y
        ? Math.PI / 2
        : distance === right
          ? Math.PI
          : -Math.PI / 2;
  return { angle, distance };
};

const closestAngle = ({
  angle,
  oldAngle,
}: {
  angle: number;
  oldAngle: number;
}) => {
  if (angle < oldAngle) {
    while (oldAngle - angle > Math.PI) {
      angle += 2 * Math.PI;
    }
  } else {
    while (angle - oldAngle > Math.PI) {
      angle -= 2 * Math.PI;
    }
  }
  return angle;
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
    const g = createG(point, edge.angle);
    const gle = createGle(point, edge.angle);
    svg.appendChild(g);
    svg.appendChild(gle);
    trails.push(new Trail(point, gle, edge.angle));
  } else {
    trail!.add(point);
    trail!.tailAngle = closestAngle({
      angle: trail!.angle()!,
      oldAngle: trail!.tailAngle,
    });
    svg.appendChild(createO(point, trail!.size() % 2 === 0));
    moveGle(trail!.tail, point, trail!.tailAngle);
  }
};

svg.addEventListener('mousemove', onMouseMove);
