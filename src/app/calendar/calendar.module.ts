import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CalendarPage} from './calendar.page';
import {CalendarDayModule} from 'angular-calendar';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {CreateDistanceModalModule} from '../components/create-distance-modal/create-distance-modal.module';
import {CreateTravelTimeModalModule} from '../components/create-travel-time-modal/create-travel-time-modal.module';
import {CreateDistanceModalComponent} from '../components/create-distance-modal/create-distance-modal.component';
import {CreateTravelTimeModalComponent} from '../components/create-travel-time-modal/create-travel-time-modal.component';
import {ConfirmationModalComponent} from '../components/confirmation-modal/confirmation-modal.component';
import {ConfirmationModalModule} from '../components/confirmation-modal/confirmation-modal.module';
import {ConfirmationActionModalComponent} from '../components/confirmation-action-modal/confirmation-action-modal.component';
import {ConfirmationActionModalModule} from '../components/confirmation-action-modal/confirmation-action-modal.module';
import {TranslateModule} from '@ngx-translate/core';
import {DeletionReasonModalComponent} from '../components/deletion-reason-modal/deletion-reason-modal.component';
import {DeletionReasonModalModule} from '../components/deletion-reason-modal/deletion-reason-modal.module';
import {ValidateAllModalComponent} from '../components/validate-all-modal/validate-all-modal.component';
import {ValidateAllModalModule} from '../components/validate-all-modal/validate-all-modal.module';
import {UserMenuModule} from '../components/user-menu/user-menu.module';
import {NotificationsPopoverComponent} from '../components/notifications-popover/notifications-popover.component';
import {AgendaItemModule} from '../components/agenda-item/agenda-item.module';
import {ValidateCalendarItemModalComponent} from '../components/validate-calendar-item-modal/validate-calendar-item-modal.component';
import {ValidateCalendarItemModalModule} from '../components/validate-calendar-item-modal/validate-calendar-item-modal.module';
import {CalendarWeekSelectorModule} from '../components/calendar-week-selector/calendar-week-selector.module';

const routes: Routes = [
    {
        path: '',
        component: CalendarPage
    }
];


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FontAwesomeModule,
        IonicModule,
        RouterModule.forChild(routes),
        AgendaItemModule,
        CalendarDayModule,
        CreateDistanceModalModule,
        CreateTravelTimeModalModule,
        ConfirmationActionModalModule,
        ValidateCalendarItemModalModule,
        ConfirmationModalModule,
        DeletionReasonModalModule,
        TranslateModule,
        ValidateAllModalModule,
        UserMenuModule,
        CalendarWeekSelectorModule
    ],
    declarations: [CalendarPage, NotificationsPopoverComponent],

    entryComponents: [
        CreateDistanceModalComponent,
        DeletionReasonModalComponent,
        ValidateCalendarItemModalComponent,
        NotificationsPopoverComponent,
        CreateTravelTimeModalComponent,
        ConfirmationModalComponent,
        ConfirmationActionModalComponent,
        ValidateAllModalComponent
    ]
})
export class CalendarPageModule {
}
