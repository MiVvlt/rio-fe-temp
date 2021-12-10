import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {TeamPage} from './team.page';
import {TranslateModule} from '@ngx-translate/core';
import {HttpClientModule} from '@angular/common/http';

const routes: Routes = [
    {
        path: '',
        component: TeamPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        HttpClientModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [TeamPage]
})
export class TeamPageModule {
}
