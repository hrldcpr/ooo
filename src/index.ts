import Trail from './Trail';

import 'sanitize.css';

import './index.scss';

const MIN_DISTANCE = 40;
const GLE_DISTANCE = MIN_DISTANCE;
const START_DISTANCE = MIN_DISTANCE;
const FADE_DELAY = 10 * 1000; // ms

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

svg.addEventListener('mousemove', ({ offsetX: x, offsetY: y }: MouseEvent) => {
  const point = { x, y };

  if (
    trails.length === 0 &&
    x > START_DISTANCE &&
    x < svg.clientWidth - START_DISTANCE &&
    y > START_DISTANCE &&
    y < svg.clientHeight - START_DISTANCE
  ) {
    const edge = closestEdge(point);

    const g = createG(point, edge.angle);
    const gle = createGle(point, edge.angle);
    const container = createSvgElement('g');
    container.appendChild(g);
    container.appendChild(gle);
    svg.appendChild(container);

    trails.push(new Trail(point, container, gle, edge.angle));
  }

  const trail = trails[trails.length - 1];
  const distance = trail.tailDistance(point);

  if (distance < MIN_DISTANCE) return;

  trail.add(point);
  trail.tailAngle = closestAngle({
    angle: trail.angle()!,
    oldAngle: trail.tailAngle,
  });
  trail.g.appendChild(createO(point, trail.size() % 2 === 0));
  moveGle(trail.tail, point, trail.tailAngle);
});

svg.addEventListener('mouseleave', () => {
  const trail = trails.pop();
  if (!trail) return;

  trail.g.classList.add('fading');
  setTimeout(() => {
    svg.removeChild(trail.g);
  }, FADE_DELAY);
});
