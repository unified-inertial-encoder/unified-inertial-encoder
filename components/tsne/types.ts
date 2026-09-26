export type TsneDataset = { label: string; embodiment: 'Human' | 'Humanoid'; marker: 'o' | 's' | '^' | 'D' | 'v' };
export type TsneRegion = { label: string; poly: [number, number][]; cx: number; cy: number };
export type TsneLayout = { key: string; label: string; xy: [number, number][]; regions: TsneRegion[] };
export type TsneIndex = {
  datasets: TsneDataset[];
  /** alternative 2-D layouts of the same windows (first = default) */
  layouts: TsneLayout[];
  /** [x, y, datasetIndex] per point */
  points: [number, number, number][];
  stems: string[];
  regions: TsneRegion[];
  fps: number;
  /** frame count per point (windows vary in length) */
  frames: number[];
  /** ordered mannequin keypoints stored per human window */
  human_points: string[];
  /** actuated joint order stored per humanoid window */
  joints: string[];
  /** 0 = human mannequin keypoints, 1 = G1 root pose + joint angles, per point */
  kind: number[];
};

export const POS_SCALE = 1000; // int16 millimetres
export const QUAT_SCALE = 32767;
export const RAD_SCALE = 5000; // int16 radians * 5000
