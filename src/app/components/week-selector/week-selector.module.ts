import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WeekSelectorComponent} from './week-selector.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {AppModule} from '../../app.module';
import {DebounceClickDirective} from '../debounce-click/debounce-click.directive';
import {DebounceClickModule} from '../debounce-click/debounce-click.module';


@NgModule({
    declarations: [WeekSelectorComponent],
    exports: [WeekSelectorComponent],
    imports: [
        CommonModule,
        IonicModule,
        DebounceClickModule,
        TranslateModule
    ]
})
export class WeekSelectorModule {
}
