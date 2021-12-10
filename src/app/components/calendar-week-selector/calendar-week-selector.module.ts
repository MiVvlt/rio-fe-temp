import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {CalendarWeekSelectorComponent} from './calendar-week-selector.component';
import {TranslateModule} from '@ngx-translate/core';
import {DebounceClickModule} from '../debounce-click/debounce-click.module';


@NgModule({
    declarations: [CalendarWeekSelectorComponent],
    exports: [CalendarWeekSelectorComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
        DebounceClickModule
    ]
})
export class CalendarWeekSelectorModule {
}
