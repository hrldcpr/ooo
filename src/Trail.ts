interface Point {
  x: number;
  y: number;
}

export default class {
  private points: Point[];
  private time: number;

  constructor(start: Point) {
    this.points = [start];
    this.time = Date.now();
  }

  add = (point: Point) => {
    this.points.push(point);
    this.time = Date.now();
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
