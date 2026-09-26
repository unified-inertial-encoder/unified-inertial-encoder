import * as React from 'react';

import { cn } from '@/lib/utils';

/* Numbers are copied verbatim from the paper's Table II (odometry) and Table III (retrieval). */

type Cell = { v: string; best?: boolean; note?: string };
const c = (v: string, best = false, note?: string): Cell => ({ v, best, note });

const ODOMETRY_GROUPS = [
  { name: 'Nymeria', emb: 'Human' },
  { name: 'Natural Motion', emb: 'Human' },
  { name: 'BONES-Seed (Human)', emb: 'Human' },
  { name: 'BONES-Seed (G1)', emb: 'Humanoid' },
  { name: 'Real-Trajectory (G1)', emb: 'Humanoid' },
];

type OdoRow = { method: React.ReactNode; ours?: boolean; cells: Cell[] };
const ODOMETRY_ROWS: { section: string; rows: OdoRow[] }[] = [
  {
    section: 'Pelvis IMU only',
    rows: [
      {
        method: <>TLIO<sup>†</sup></>,
        cells: [
          c('0.122'), c('8.149'), c('17.76', true),
          c('0.189'), c('40.72'), c('81.31'),
          c('0.245'), c('0.717'), c('0.719'),
          c('0.173'), c('0.761'), c('0.762'),
          c('0.371'), c('17.86'), c('17.86'),
        ],
      },
      {
        method: <>AirIMU<sup>†</sup></>,
        cells: [
          c('12.62'), c('–'), c('–'),
          c('109.3'), c('–'), c('–'),
          c('0.212'), c('9.472'), c('505.5'),
          c('0.281'), c('11.83'), c('306.6'),
          c('6.231'), c('731.1'), c('–'),
        ],
      },
      {
        method: <>AirIO<sup>†</sup></>,
        cells: [
          c('0.069'), c('7.481'), c('113.9'),
          c('0.280'), c('158.1'), c('157.9'),
          c('0.140'), c('0.530'), c('1.918'),
          c('0.118'), c('0.720'), c('1.690'),
          c('0.350'), c('16.82'), c('20.48'),
        ],
      },
      {
        method: 'TartanIMU',
        cells: [
          c('0.301'), c('37.74'), c('35.53'),
          c('0.332'), c('155.8'), c('156.3'),
          c('0.328', false, '*'), c('2.970', false, '*'), c('2.964', false, '*'),
          c('0.219', false, '*'), c('2.176', false, '*'), c('2.176', false, '*'),
          c('0.391'), c('18.94'), c('18.96'),
        ],
      },
    ],
  },
  {
    section: 'Pelvis IMU + joint positions and velocities',
    rows: [
      {
        method: <>AirIO w/ joints<sup>†</sup></>,
        cells: [
          c('0.060'), c('6.912'), c('39.64'),
          c('0.080'), c('14.11'), c('209.2'),
          c('0.205'), c('0.907'), c('1.652'),
          c('0.123'), c('0.620'), c('1.565'),
          c('0.190'), c('5.976'), c('22.25'),
        ],
      },
    ],
  },
  {
    section: 'Shared 12-site multi-IMU input',
    rows: [
      {
        method: 'Ours',
        ours: true,
        cells: [
          c('0.026', true), c('2.468', true), c('18.20'),
          c('0.049', true), c('7.456', true), c('50.54', true),
          c('0.031', true), c('0.113', true), c('0.148', true),
          c('0.024', true), c('0.101', true), c('0.127', true),
          c('0.099', true), c('3.153', true), c('11.50', true),
        ],
      },
    ],
  },
];

function CellView({ cell }: { cell: Cell }) {
  return (
    <td className={cn(cell.best && 'font-bold text-gray-900')}>
      {cell.v}
      {cell.note ? <sup>{cell.note}</sup> : null}
    </td>
  );
}

export function OdometryTable({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className='results-table'>
        <thead>
          <tr className='border-t-2 border-gray-800'>
            <th rowSpan={3} className='align-bottom'>Method</th>
            <th colSpan={9} className='text-center! text-primary-700'>
              <span className='block border-b border-gray-400 pb-1'>Human</span>
            </th>
            <th colSpan={6} className='text-center! text-amber-700'>
              <span className='block border-b border-gray-400 pb-1'>Humanoid (G1)</span>
            </th>
          </tr>
          <tr>
            {ODOMETRY_GROUPS.map((g) => (
              <th key={g.name} colSpan={3} className='text-center! font-medium'>
                <span className='block border-b border-gray-300 pb-1'>{g.name}</span>
              </th>
            ))}
          </tr>
          <tr className='border-b border-gray-800 text-gray-500 font-normal'>
            {ODOMETRY_GROUPS.map((g) => (
              <React.Fragment key={g.name}>
                <th className='font-normal'>AVE</th>
                <th className='font-normal'>ATE<sub>GT</sub></th>
                <th className='font-normal'>ATE<sub>Pred</sub></th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {ODOMETRY_ROWS.map((sec) => (
            <React.Fragment key={sec.section}>
              <tr>
                <td colSpan={16} className='pt-3 pb-1 text-xs italic text-gray-500'>
                  {sec.section}
                </td>
              </tr>
              {sec.rows.map((row, i) => (
                <tr key={i} className={cn(row.ours ? 'bg-ours font-medium border-b-2 border-gray-800' : 'hover:bg-gray-50')}>
                  <td className={cn(!row.ours && 'pl-5')}>{row.method}</td>
                  {row.cells.map((cell, j) => (
                    <CellView key={j} cell={cell} />
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type LangRow = { method: React.ReactNode; ours?: boolean; cells: [Cell, Cell][] };
const LANGUAGE_COLS = ['Nymeria', 'BONES-Seed', 'G1 · seen categories', 'G1 · unseen categories'];
const LANGUAGE_ROWS: LangRow[] = [
  {
    method: 'Collapse',
    cells: [
      [c('4.4'), c('0.1')], [c('19.7'), c('0.2')], [c('21.9'), c('0.8')], [c('9.8'), c('0.1')],
    ],
  },
  {
    method: 'ImageBind',
    cells: [
      [c('8.9'), c('0.1')], [c('7.1'), c('0.4')], [c('11.4'), c('1.6')], [c('4.6'), c('0.1')],
    ],
  },
  {
    method: <>IMU2CLIP<sup>†</sup></>,
    cells: [
      [c('16.2', true), c('0.4')], [c('51.8'), c('5.2')], [c('36.1'), c('11.2')], [c('17.3'), c('0.5')],
    ],
  },
  {
    method: 'Ours',
    ours: true,
    cells: [
      [c('14.9'), c('0.6', true)], [c('60.7', true), c('15.9', true)], [c('63.4', true), c('32.9', true)], [c('53.8', true), c('11.3', true)],
    ],
  },
];

export function LanguageTable({ className }: { className?: string }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className='results-table'>
        <thead>
          <tr className='border-t-2 border-gray-800'>
            <th rowSpan={2} className='align-bottom'>Method</th>
            <th colSpan={2} className='text-center! text-primary-700'>
              <span className='block border-b border-gray-400 pb-1'>Human</span>
            </th>
            <th colSpan={2} className='text-center! text-amber-700'>
              <span className='block border-b border-gray-400 pb-1'>Humanoid (G1)</span>
            </th>
          </tr>
          <tr className='border-b border-gray-800'>
            {LANGUAGE_COLS.map((name) => (
              <th key={name} className='text-center! font-medium'>
                {name}
                <div className='text-[0.7rem] font-normal text-gray-500'>R@1 / mAP (%)</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {LANGUAGE_ROWS.map((row, i) => (
            <tr key={i} className={cn(row.ours ? 'bg-ours font-medium border-b-2 border-gray-800' : 'hover:bg-gray-50')}>
              <td>{row.method}</td>
              {row.cells.map(([r1, map], j) => (
                <td key={j} className='text-center!'>
                  <span className={cn(r1.best && 'font-bold text-gray-900')}>{r1.v}</span>
                  <span className='text-gray-400'> / </span>
                  <span className={cn(map.best && 'font-bold text-gray-900')}>{map.v}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
