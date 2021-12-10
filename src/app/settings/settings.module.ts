import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SettingsPage} from './settings.page';
import {TranslateModule} from '@ngx-translate/core';
import {UserMenuModule} from '../components/user-menu/user-menu.module';
import {Globalization} from '@ionic-native/globalization/ngx';

const routes: Routes = [
    {
        path: '',
        component: SettingsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        UserMenuModule,
        RouterModule.forChild(routes)
    ],
    providers: [Globalization],
    declarations: [SettingsPage]
})
export class SettingsPageModule {
}
