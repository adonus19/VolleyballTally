import { Directive, EventEmitter, HostListener, Input, OnDestroy, Output } from '@angular/core';

@Directive({ selector: '[longPress]', standalone: true })
export class LongPressDirective implements OnDestroy {
    @Input() pressDuration = 500;
    @Output() longPress = new EventEmitter<void>();
    private timer: any;
    @HostListener('pointerdown') onDown() {
        this.clear();
        this.timer = setTimeout(() => this.longPress.emit(), this.pressDuration);
    }
    @HostListener('pointerup') onUp() {
        this.clear();
    }
    @HostListener('pointerleave') onLeave() {
        this.clear();
    }

    ngOnDestroy() {
        this.clear();
    }

    private clear() {
        if (this.timer) {
            clearTimeout(this.timer); this.timer = null;
        }
    }
}