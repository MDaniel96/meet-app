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

export const fadeInOutAnimation = trigger('fadeInOut', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
    ])
]);