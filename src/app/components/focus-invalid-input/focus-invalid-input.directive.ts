import {Directive, HostListener, ElementRef} from '@angular/core';

@Directive({
    selector: '[appFocusInvalidInput]'
})
export class FocusInvalidInputDirective {
    constructor(private el: ElementRef) {
    }

    @HostListener('ngSubmit')
    onFormSubmit() {
        const invalidControl = this.el.nativeElement.querySelector('.ion-invalid > .ng-invalid');
        console.log(invalidControl);

        if (invalidControl) {
            invalidControl.click();
        }
    }
}
