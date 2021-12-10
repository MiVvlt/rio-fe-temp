import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {UserMenuPopoverComponent} from './user-menu-popover/user-menu-popover.component';
import {UserMenuComponent} from './user-menu.component';


@NgModule({
    declarations: [UserMenuComponent, UserMenuPopoverComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
    ],
    exports: [
        UserMenuComponent
    ],
    entryComponents: [UserMenuPopoverComponent]
})
export class UserMenuModule {
}
