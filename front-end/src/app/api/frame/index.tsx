import * as FrameInterface from '@/models/frame';
import SwapResult from './frames/swap-result';
import PendlePt from './frames/pendle-pt';
import PendleExplorer from './frames/pendle-explorer';
import PendleMain from './frames/pendle-main';
import PendleEvent from './frames/pendle-event';

const frames: FrameInterface.FrameComponents = {
  SwapResult,
  PendlePt,
  PendleExplorer,
  PendleMain,
  PendleEvent,
};

export default frames;
