import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MenuPage} from './menu.page';
import {AuthGuardService} from '../guard/auth-guard.service';
import {MenuHeaderModule} from '../components/menu-header/menu-header.module';
import {MenuItemModule} from '../components/menu-item/menu-item.module';
import {TranslateModule} from '@ngx-translate/core';
import {CallNumber} from '@ionic-native/call-number/ngx';

const routes: Routes = [
    {
        path: '',
        redirectTo: '/menu/login',
        pathMatch: 'full'
    },
    {
        path: '',
        component: MenuPage,
        children: [

            {
                path: 'calendar',
                loadChildren: '../calendar/calendar.module#CalendarPageModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'calendar/expensemodal',
                loadChildren: '../components/expenses-modal/expenses-modal.module#ExpensesModalModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'calendar/:id',
                loadChildren: '../calendar-item/calendar-item.module#CalendarItemModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'calendar/edit/:id',
                loadChildren: '../edit-calendar-item/edit-calendar-item.module#EditCalendarItemPageModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'calendar/edit-absence/:id',
                loadChildren: '../edit-absence-item/edit-absence-item.module#EditAbsenceItemPageModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'clients',
                loadChildren: '../clients/clients.module#ClientsPageModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'expenses',
                loadChildren: '../expenses/expenses.module#ExpensesPageModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'settings',
                loadChildren: '../settings/settings.module#SettingsPageModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'team',
                loadChildren: '../team/team.module#TeamPageModule',
                canActivate: [AuthGuardService]
            }, {
                path: 'session-details/:id',
                loadChildren: '../session-details/session-details.module#SessionDetailsPageModule',

                canActivate: [AuthGuardService]
            }, {
                path: 'login',
                loadChildren: '../login/login.module#LoginPageModule',
            }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MenuHeaderModule,
        MenuItemModule,
        TranslateModule
    ],
    exports: [
        MenuPage,
    ],
    providers: [
        CallNumber
    ],
    declarations: [MenuPage],
    entryComponents: []
})
export class MenuPageModule {
}
