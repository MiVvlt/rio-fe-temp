import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FocusInvalidInputDirective} from './focus-invalid-input.directive';


@NgModule({
    declarations: [FocusInvalidInputDirective],
    exports: [FocusInvalidInputDirective],
    imports: [
        CommonModule
    ]
})
export class FocusInvalidInputModule {
}
