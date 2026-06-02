import { computeBearingBearing } from './math';

test('parallel bearings throw error', () => {
  const p1 = { x: 1000, y: 1000 };
  const p2 = { x: 2000, y: 2000 };
  
  // Both paths firing due North (0°) means they will never intersect
  expect(() => computeBearingBearing(p1, 0, p2, 0)).toThrow(
    "Bearings are parallel; no unique intersection exists."
  );
});