import {
    trigger,
    transition,
    style,
    animate
} from '@angular/animations';

export const slideRightLeftAnimation = trigger('slideInOut', [
    transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('350ms ease-in', style({ transform: 'translateX(0%)' }))
    ]),
    transition(':leave',
        animate('350ms ease-in', style({ transform: 'translateX(100%)' }))
    )
]);

export const slideTopBottomAnimation = trigger('slideTopBottom', [
    transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('350ms ease-in', style({ transform: 'translateY(0%)' }))
    ]),
    transition(':leave',
        animate('350ms ease-in', style({ transform: 'translateY(-100%)' }))
    )
]);

export const foldAnimation = trigger('fold', [
    transition(':enter', [
        style({ height: 0, overflow: 'hidden' }),
        animate('350ms ease-in', style({ height: '*' }))
    ]),
    transition(':leave', [
        style({ height: '*', overflow: 'hidden' }),
        animate('350ms ease-in', style({ height: 0 }))
    ])
]);

export const horizontalFoldAnimation = trigger('horizontalFold', [
    transition(':enter', [
        style({ width: 0 }),
        animate('250ms ease-in', style({ width: '70%' }))
    ]),
    transition(':leave', [
        style({ width: '70%' }),
        animate('250ms ease-in', style({ width: 0 }))
    ])
]);

export const fadeInOutAnimation = trigger('fadeInOut', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
    ])
]);