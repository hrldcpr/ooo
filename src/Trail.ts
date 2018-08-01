interface Point {
  x: number;
  y: number;
}

export default class {
  tail: SVGElement;
  tailAngle: number;
  private points: Point[];
  private time: number;

  constructor(start: Point, tail: SVGElement, tailAngle: number) {
    this.tail = tail;
    this.tailAngle = tailAngle;
    this.points = [start];
    this.time = Date.now();
  }

  add = (point: Point) => {
    this.points.push(point);
    this.time = Date.now();
  };

  angle = (): number | undefined => {
    if (this.points.length < 2) return;
    const [a, b] = this.points.slice(-2);
    return Math.atan2(b.y - a.y, b.x - a.x);
  };

  distance = (point: Point): number =>
    Math.min(
      ...this.points.map(({ x, y }) => Math.hypot(point.x - x, point.y - y))
    );

  size = (): number => this.points.length;

  tailDistance = (point: Point): number => {
    const { x, y } = this.points[this.points.length - 1];
    return Math.hypot(point.x - x, point.y - y);
  };
}
