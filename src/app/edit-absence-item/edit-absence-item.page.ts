import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CalendarService} from '../service/calendar.service';
import {isNullOrUndefined} from 'util';
import {PickerController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {AbsenceType} from '../interface/AbsenceType';
import {AbsenceTypesService} from '../service/absencetypes.service';
import {SessionEvent} from '../interface/SessionEvent';

@Component({
    selector: 'app-edit-absence-item',
    templateUrl: './edit-absence-item.page.html',
    styleUrls: ['./edit-absence-item.page.scss'],
})
export class EditAbsenceItemPage implements OnInit {
    public id;
    public calendarEvent: SessionEvent;

    absenceTypes: AbsenceType[];
    currentType: AbsenceType;
    absenceTypeForm: string;
    current: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private pickerCtrl: PickerController,
        private calendarService: CalendarService,
        private translateService: TranslateService,
        private absenceTypesService: AbsenceTypesService,
        private router: Router
    ) {
    }

    async ngOnInit() {
        this.id = await this.getId();
        this.calendarEvent = await this.calendarService.getCalendarEventById(this.id);
        this.absenceTypes = await this.absenceTypesService.getAbsenceTypesAsync(this.calendarEvent.dataset);
        this.currentType = await this.absenceTypesService.getAbsenceTypeByDatasetAndId(this.calendarEvent.dataset, this.calendarEvent.sessionType);
        this.current = this.currentType.name;
    }

    getId(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.activatedRoute.params.subscribe((val) => {
                if (!isNullOrUndefined(val.id)) {
                    resolve(val.id);
                } else {
                    reject(new Error('Id is undefined'));
                }
            });
        });
    }


    public submit() {
        this.absenceTypesService.changeAbsenceType(this.absenceTypeForm, this.calendarEvent.id);
        this.router.navigate(['/menu/calendar/']);
    }

}
