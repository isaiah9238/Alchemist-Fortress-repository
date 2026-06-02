import { bearingBearing } from './math';

test('parallel bearings throw error', () => {
  expect(() => bearingBearing(/* parallel points */)).toThrow("Bearings are parallel");
});