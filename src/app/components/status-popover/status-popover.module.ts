import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatusPopoverComponent} from './status-popover.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
    declarations: [StatusPopoverComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule
    ],
    entryComponents: [StatusPopoverComponent],
    exports: [StatusPopoverComponent]
})
export class StatusPopoverModule {
}
