import Trail from './Trail';

import 'sanitize.css';

import './index.scss';

const G_DISTANCE = 50;
const O_DISTANCE = 40;
const GLE_LENGTH = 74;
const EDGE_DISTANCE = 40;
const START_DISTANCE = 80;
const FADE_DELAY = 10 * 1000; // ms

const createSvgElement = (tag: string, attributes?: any) => {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attributes) {
    e.setAttribute(k, attributes[k]);
  }
  return e;
};

const createG = ({ x, y }: { x: number; y: number }, angle: number) =>
  createSvgElement('path', {
    transform: `translate(${x}, ${y}) rotate(${(angle * 180) /
      Math.PI}) translate(-29, -37)`,
    fill: '#4285F4',
    d:
      'M29.95,59.05C13.68,59.05,0,45.8,0,29.52S13.68,0,29.95,0c9,0,15.41,3.53,20.23,8.14l-5.69,5.69c-3.46-3.24-8.14-5.76-14.55-5.76c-11.88,0-21.17,9.58-21.17,21.46c0,11.88,9.29,21.46,21.17,21.46c7.71,0,12.1-3.1,14.91-5.9c2.3-2.3,3.82-5.65,4.39-10.18h-19.3v-8H57.1c0.29,1.44,0.43,3.13,0.43,5.01c0,6.05-1.66,13.54-6.99,18.87C45.36,56.17,38.74,59.05,29.95,59.05z',
  });

const createO = ({ x, y }: { x: number; y: number }, parity: boolean) => {
  const o = createSvgElement('path', {
    transform: `translate(${x}, ${y}) translate(-120, -38)`,
    fill: parity ? '#E94235' : '#FABB05',
    d:
      'M139.49,40.04c0,10.94-8.51,19.01-18.95,19.01c-10.44,0-18.95-8.07-18.95-19.01c0-11.02,8.51-19.01,18.95-19.01C130.98,21.03,139.49,29.02,139.49,40.04z M131.19,40.04c0-6.84-4.93-11.52-10.66-11.52c-5.72,0-10.65,4.68-10.65,11.52c0,6.77,4.93,11.52,10.65,11.52C126.26,51.56,131.19,46.8,131.19,40.04z',
  });
  o.classList.add('o');
  return o;
};

const createGle = (point: { x: number; y: number }, angle: number) => {
  const g = createSvgElement('g');
  g.classList.add('gle');
  g.appendChild(
    createSvgElement('path', {
      fill: '#4285F4',
      d:
        'M178.54,22.18v33.81c0,14.04-8.28,19.8-18.07,19.8c-9.22,0-14.76-6.19-16.85-11.23l7.27-3.02c1.3,3.1,4.46,6.77,9.58,6.77c6.26,0,10.15-3.89,10.15-11.16v-2.42h-0.29c-1.87,2.3-5.47,4.32-10.01,4.32c-9.5,0-17.78-8.28-17.78-18.94c0-10.73,8.28-19.08,17.78-19.08c4.54,0,8.14,2.02,10.01,4.25h0.29v-3.1H178.54z M171.19,40.11c0-6.7-4.42-11.59-10.06-11.59c-5.71,0-10.25,4.9-10.25,11.59c0,6.62,4.54,11.45,10.25,11.45C166.77,51.56,171.19,46.73,171.19,40.11z',
    })
  );
  g.appendChild(
    createSvgElement('path', {
      fill: '#34A853',
      d: 'M192.31,2.02v55.88h-8.35V2.02H192.31z',
    })
  );
  g.appendChild(
    createSvgElement('path', {
      fill: '#E94235',
      d:
        'M224.07,46.3l6.48,4.32c-2.09,3.1-7.13,8.42-15.84,8.42c-10.8,0-18.87-8.35-18.87-19.01c0-11.31,8.14-19.01,17.93-19.01c9.86,0,14.69,7.85,16.27,12.1l0.86,2.16L205.49,45.8c1.94,3.82,4.97,5.76,9.22,5.76S221.91,49.47,224.07,46.3z M204.12,39.46l16.99-7.06c-0.94-2.38-3.75-4.03-7.06-4.03C209.81,28.37,203.9,32.12,204.12,39.46z',
    })
  );
  moveGle(g, point, angle);
  return g;
};

const moveGle = (
  gle: SVGElement,
  { x, y }: { x: number; y: number },
  angle: number
) => {
  gle.style.transform = `translate(${x}px, ${y}px) rotate(${angle}rad) translate(-120px, -40px)`;
};

const svg = document.getElementById('floor')!;
const trails: Trail[] = [];
let enabled = false;

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
  if (!enabled) return;
  const point = { x, y };

  if (trails.length === 0) {
    if (
      x < EDGE_DISTANCE ||
      svg.clientWidth - x < EDGE_DISTANCE ||
      y < EDGE_DISTANCE ||
      svg.clientHeight - y < EDGE_DISTANCE
    ) {
      return;
    }

    document.getElementById('note').classList.add('fading');

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

  const minDistance = trail.size() === 1 ? G_DISTANCE : O_DISTANCE;
  if (distance < minDistance) return;

  trail.add(point);
  trail.tailAngle = closestAngle({
    angle: trail.angle()!,
    oldAngle: trail.tailAngle,
  });

  const tailPoint = {
    x: point.x + GLE_LENGTH * Math.cos(trail.tailAngle),
    y: point.y + GLE_LENGTH * Math.sin(trail.tailAngle),
  };
  if (
    tailPoint.x < EDGE_DISTANCE ||
    svg.clientWidth - tailPoint.x < EDGE_DISTANCE ||
    tailPoint.y < EDGE_DISTANCE ||
    svg.clientHeight - tailPoint.y < EDGE_DISTANCE
  ) {
    trail.pop();
    return;
  }

  trail.g.appendChild(createO(point, trail.size() % 2 === 0));
  moveGle(trail.tail, point, trail.tailAngle);
});

svg.addEventListener('mouseleave', () => {
  enabled = true;

  const trail = trails.pop();
  if (!trail) return;

  trail.g.classList.add('fading');
  setTimeout(() => {
    svg.removeChild(trail.g);
  }, FADE_DELAY);
});
