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

export const MenuDropDownAnimation = 
trigger(CanonicalAnimationTriggers.MENU_STATE, [
    state(CanonicalAnimationStates.SHOW, style({
      visibility: 'visible'
    })),
    state(CanonicalAnimationStates.HIDE, style({
      visibility: 'hidden',
      height: '0px'
    })),
    transition(CanonicalTransitionStates.SHOW_TO_HIDE, [
      animate('75ms ease-in', keyframes([
        style({opacity: 1, transform: 'scale(1,1)'}),
        style({opacity: 0, transform: 'scale(.95,.95)'})
      ]))
    ]),
    transition(CanonicalTransitionStates.HIDE_TO_SHOW, [
      animate('100ms ease-out', keyframes([
        style({opacity: 0, transform: 'scale(.95,.95)'}),
        style({opacity: 1, transform: 'scale(1,1)'})
      ]))
    ])
  ]);