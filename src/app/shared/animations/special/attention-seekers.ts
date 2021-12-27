import { CanonicalAnimationTriggers } from '../providers/canonical-animation-triggers';
import { CanonicalTransitionStates } from '../providers/canonical-transition-states';
import { CanonicalAnimationStates } from '../providers/canonical-animation-states';

import {
    trigger,
    state,
    style,
    animate,
    transition,
    keyframes
} from '@angular/animations';

export const HeartBeatAnimation = 
trigger(CanonicalAnimationTriggers.HEARTBEAT, [
    transition(CanonicalTransitionStates.VOID_TO_TRUE, [
      animate('800ms ease-in', keyframes([
        style({opacity: 1, transform: 'scale(1)', offset: 0}),
        style({opacity: 1, transform: 'scale(1.3)', offset: .14}),
        style({opacity: 1, transform: 'scale(1)', offset: .28}),
        style({opacity: 1, transform: 'scale(1.3)', offset: .42}),
        style({opacity: 1, transform: 'scale(1)', offset: 1}),
      ]))
    ])
  ]);