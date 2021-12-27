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

export const FadeInOut =
trigger(CanonicalAnimationTriggers.FADE, [
    transition(CanonicalTransitionStates.VOID_TO_TRUE, [
      animate('300ms ease-in', keyframes([
        style({opacity: 0}),
        style({opacity: 1})
      ]))
    ]),
    transition(CanonicalTransitionStates.TRUE_TO_VOID, [
      animate('200ms ease-out', keyframes([
        style({opacity: 1}),
        style({opacity: 0})
      ]))
    ])
  ]);