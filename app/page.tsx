'use client';

import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';

import KatexSpan from '@/components/KaTeX';
import ArrowLink from '@/components/links/ArrowLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import { LanguageTable, OdometryTable } from '@/components/ResultsTables';
import VideoCard from '@/components/VideoCard';
import VideoCarousel from '@/components/VideoCarousel';
import ScalingExplorer from '@/components/ScalingExplorer';
import ScalingSurface from '@/components/ScalingSurface';
import TsneExplorer from '@/components/tsne/TsneExplorer';
import { asset } from '@/lib/utils';

const PAPER_PDF = '/paper/unified-inertial-encoder.pdf';

export default function HomePage() {
  const textColor = 'text-gray-600';
  const bgColor = 'bg-white';
  const secondaryBgColor = 'bg-gray-100';

  const sliderItems: { title: string; src: string; poster: string; duration: string }[] = [
    { title: 'Motivation', src: '/video/segment1-motivation.mp4', poster: '/images/posters/motivation.jpg', duration: '0:53' },
    { title: 'Method', src: '/video/segment2-method.mp4', poster: '/images/posters/method.jpg', duration: '1:42' },
    { title: 'Results', src: '/video/segment3-results.mp4', poster: '/images/posters/results.jpg', duration: '0:22' },
  ];
  const sliderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const middleChild = slider.children[1] as HTMLElement | undefined;
    if (!middleChild) return;
    slider.scrollLeft = middleChild.offsetLeft - (slider.clientWidth - middleChild.clientWidth) / 2;
  }, []);

  return (
    <main>
      {/* ---------------------------------------------------------------- Hero */}
      <section
        className={clsx(bgColor, textColor, 'relative flex items-center justify-center h-screen overflow-hidden')}
      >
        <div className='layout z-20 relative flex min-h-screen flex-col items-center justify-center p-4 text-center'>
          <h1 className='mt-4 text-4xl md:text-5xl mb-4 leading-tight text-gray-800'>
            A Unified Inertial Encoder for Human and Humanoid Motions
          </h1>
          <div className='container pb-6'>
            <span className='text-lg'>Anonymous Authors</span>
          </div>
          <div className='container flex flex-row flex-wrap items-center gap-x-8 gap-y-2 justify-center text-lg'>
            <ArrowLink className='mt-6' href={asset(PAPER_PDF)} openNewTab>
              Paper
            </ArrowLink>
            <ArrowLink className='mt-6' href='#video'>
              Video
            </ArrowLink>
            <span className='mt-6 text-gray-500 select-none'>Code (Coming Soon)</span>
          </div>
        </div>
        <video autoPlay loop muted playsInline className='absolute inset-0 w-full h-full z-0 object-cover object-center'>
          <source src={asset('/video/hero.mp4')} type='video/mp4' />
        </video>
      </section>

      {/* ------------------------------------------------------------ Abstract */}
      <section className={clsx(secondaryBgColor, textColor)}>
        <div className='layout py-12'>
          <h2 className='text-center pb-4'>Abstract</h2>
          <p className='text-pretty'>
            Wearable motion capture and humanoid robots both measure motion with IMUs, yet the two embodiments differ in
            morphology, sensor placement, and sampling rate, and kinematically generated humanoid data lack the
            contact dynamics and sensor imperfections of hardware. We present{' '}
            <b>one inertial representation that bridges both gaps</b>: a shared interface of twelve anatomically
            corresponding sites, a continuous-time encoder for arbitrary sampling rates, and a Transformer trained
            jointly on real human motion and IK-retargeted Unitree G1 motion with velocity, trajectory, denoising, and
            language objectives. Deployed on a physical G1{' '}
            <b>without dynamics simulation, real-robot training data, or fine-tuning</b>, a single checkpoint achieves
            the lowest velocity error among the evaluated methods on three human datasets, retargeted G1 motion, and
            real-G1 recordings, and transfers language-grounded motion semantics from humans to the robot.
          </p>
        </div>
      </section>

      {/* --------------------------------------------------------------- Video */}
      <section id='video' className={clsx(bgColor, textColor, 'py-12')}>
        <div className='layout'>
          <h2 className='text-center pb-8'>Video</h2>
        </div>
        <div className='relative'>
          <div
            ref={sliderRef}
            className='flex overflow-x-auto snap-x snap-mandatory scroll-smooth gap-6 px-6 md:px-48 pb-4 scrollbar-light'
            aria-label='Video segments'
          >
            {sliderItems.map((item, i) => (
              <article
                key={item.title}
                className='flex-none snap-center w-[85%] md:w-[70%] lg:w-[55%] bg-white border border-gray-300 p-5 md:p-6'
              >
                <div className='flex items-baseline justify-between mb-4'>
                  <h3 className='text-xl md:text-2xl font-semibold text-gray-800'>
                    <span className='mr-3 text-primary-600 tabular-nums'>0{i + 1}</span>
                    {item.title}
                  </h3>
                  <span className='text-xs font-medium text-gray-400 tabular-nums'>{item.duration}</span>
                </div>
                <VideoCard src={item.src} poster={item.poster} title={item.title} />
              </article>
            ))}
          </div>
          <div className='pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-white to-transparent' />
          <div className='pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-white to-transparent' />
        </div>
      </section>

      {/* ------------------------------------------------------- Real G1 demos */}
      <section className={clsx(secondaryBgColor, textColor)}>
        <div className='layout pt-4 pb-4'>
          <h2 className='mt-12 mb-2'>Zero-shot on a Real Unitree G1</h2>
          <p className='text-pretty mb-6'>
            Trained on no real-robot trajectory, the model estimates the pelvis path on hardware from inertial
            measurements alone. Left: the recording. Right: our estimate, with the robot posed from the measured joints
            along the predicted trajectory (gold).
          </p>
        </div>
        <div className='layout grid grid-cols-2 md:grid-cols-4 gap-3 items-stretch pb-16'>
          <DemoTile src='/images/stairs_up_photo.jpg' label='Recording · climbing' alt='G1 climbing stairs (photo)' />
          <DemoTile src='/images/stairs_up_ours.png' label='Ours' alt='Our estimated trajectory while climbing' highlight />
          <DemoTile src='/images/stairs_down_photo.jpg' label='Recording · descending' alt='G1 descending stairs (photo)' />
          <DemoTile src='/images/stairs_down_ours.png' label='Ours' alt='Our estimated trajectory while descending' highlight />
        </div>
      </section>

      {/* ------------------------------------------------------------- Results */}
      <section className={clsx(bgColor, textColor)}>
        <div className='layout pt-4 pb-24'>
          <h2 className='mt-12 mb-2'>Inertial Odometry</h2>
          <p className='text-pretty mb-4'>
            One checkpoint, five datasets. AVE in m/s, ATE in m; ATE<sub>GT</sub> uses ground-truth attitude,
            ATE<sub>Pred</sub> the gyro-integrated attitude. <sup>†</sup> trained separately per dataset,{' '}
            <sup>*</sup> sequences longer than 10 s only.
          </p>
          <OdometryTable />
          <figure className='mt-8'>
            <VideoCarousel
              items={[
                { src: '/video/qual_traj_3d.mp4', label: 'Recordings shown in the paper' },
                { src: '/video/qual_traj_3d_set1.mp4', label: 'Held-out set 1' },
                { src: '/video/qual_traj_3d_set2.mp4', label: 'Held-out set 2' },
                { src: '/video/qual_traj_3d_set3.mp4', label: 'Held-out set 3' },
                { src: '/video/qual_traj_3d_set4.mp4', label: 'Held-out set 4' },
                { src: '/video/qual_traj_3d_set5.mp4', label: 'Held-out set 5' },
              ]}
            />
            <figcaption className='mt-3 font-light text-pretty text-gray-600'>
              One held-out recording per dataset, equal 3D axis scales. Predicted pelvis velocities of ours (gold)
              and AirIO (blue) are integrated with ground-truth attitude and drawn against ground truth (gray); each
              take plays at its own speed so all five finish together. Use the arrows for five further sets.
            </figcaption>
          </figure>

          <h2 className='mt-16 mb-2'>IMU–Language Retrieval</h2>
          <p className='text-pretty mb-4'>
            Recall@1 against 19 distractors and mean average precision, in %. The G1 categories withheld from
            retargeted-G1 training are recovered from human supervision.
          </p>
          <LanguageTable />

          <h2 className='mt-16 mb-2'>Learned Representation</h2>
          <p className='text-pretty mb-4'>
            t-SNE of human (blue) and humanoid (gold) window embeddings, either the language-head output or the trunk{' '}
            <code>[CLS]</code> feature; dashed regions enclose 60% of the windows of each labeled motion category. Rest
            the pointer on a point for a second (or tap it) to see the 4-s motion it encodes.
          </p>
          <div className='mx-auto w-full md:w-4/5'>
            <TsneExplorer />
          </div>
          <h3 className='mt-16 mb-2 text-gray-800'>Compute scaling</h3>
          <p className='text-pretty mb-4'>
            Seven model sizes (2.8–274 M parameters), 235 EMA checkpoints. A Chinchilla-style fit{' '}
            <KatexSpan text='L(N,D)=E+A/N^{\alpha}+B/D^{\beta}' /> gives{' '}
            <KatexSpan text='N_{\mathrm{opt}}\propto C^{0.52}' /> and <KatexSpan text='D_{\mathrm{opt}}\propto C^{0.48}' />.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-start'>
            <div>
              <div className='mb-1 text-center text-sm font-medium text-gray-700'>(a) Measured scaling</div>
              <ScalingExplorer height={400} />
            </div>
            <div>
              <div className='mb-1 text-center text-sm font-medium text-gray-700'>(b) Fitted loss surface</div>
              <ScalingSurface height={400} />
            </div>
          </div>
          <p className='mt-3 text-xs text-gray-500 text-pretty'>
            (a) Dots are EMA checkpoints; hover one for its run, measured error, and the law&apos;s prediction. Solid lines are
            seed-averaged measurements, dotted lines the fitted law at that model size, the dashed line the fitted
            compute-optimal frontier. (b) The fitted law over model size and tokens with the same checkpoints; hover
            anywhere for the predicted error (snapping to a nearby checkpoint shows its measured error too), drag to
            rotate. Dashed contours hold 6ND fixed; gold marks fitted minima and their path.
          </p>
        </div>
      </section>

      <footer className={clsx(secondaryBgColor, 'border-t border-gray-200 text-gray-500 text-xs')}>
        <div className='layout py-6 flex justify-end'>
          <span>
            Page template adapted from{' '}
            <UnderlineLink href='https://co-me-tokens.github.io/' className='text-gray-600'>
              Co-Me
            </UnderlineLink>
            .
          </span>
        </div>
      </footer>
    </main>
  );
}

function DemoTile({ src, label, alt, highlight = false }: { src: string; label: string; alt: string; highlight?: boolean }) {
  return (
    <div className='relative overflow-hidden border border-gray-300 bg-white aspect-video'>
      <img
        src={asset(src)}
        alt={alt}
        loading='lazy'
        className={clsx('absolute inset-0 w-full h-full', highlight ? 'object-contain' : 'object-cover')}
      />
      <div
        className={clsx(
          'absolute left-0 top-0 text-xs font-medium px-2 py-1',
          highlight ? 'bg-primary-600 text-white' : 'bg-gray-800 text-white'
        )}
      >
        {label}
      </div>
    </div>
  );
}
