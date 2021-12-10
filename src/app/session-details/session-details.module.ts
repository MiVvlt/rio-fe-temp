import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SessionDetailsPage} from './session-details.page';
import {TranslateModule} from '@ngx-translate/core';
import {CalendarService} from '../service/calendar.service';

const routes: Routes = [
    {
        path: '',
        component: SessionDetailsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [SessionDetailsPage],
    providers: [
        CalendarService
    ]
})
export class SessionDetailsPageModule {
}
