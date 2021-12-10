import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {EditAbsenceItemPage} from './edit-absence-item.page';
import {TranslateModule} from '@ngx-translate/core';
import {AgendaItemModule} from '../components/agenda-item/agenda-item.module';

const routes: Routes = [
    {
        path: '',
        component: EditAbsenceItemPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule,
        AgendaItemModule,
    ],
    declarations: [EditAbsenceItemPage],
})
export class EditAbsenceItemPageModule {
}
