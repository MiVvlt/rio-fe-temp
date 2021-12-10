import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'app-calendar-week-selector',
    templateUrl: './calendar-week-selector.component.html',
    styleUrls: ['./calendar-week-selector.component.scss'],
})
export class CalendarWeekSelectorComponent implements OnInit {
    @Input() showHandles: boolean;
    @Input() viewWeek: { start: any, end: any }[];
    @Input() weekChanged: boolean;
    @Input() viewDate: Date;
    @Output() debounceNextWeekClicked: EventEmitter<{
        viewWeek: { start: any, end: any }[],
        weekChanged: boolean,
        viewDate: Date
    }> = new EventEmitter();
    @Output() debounceLastWeekClicked: EventEmitter<{
        viewWeek: { start: any, end: any }[],
        weekChanged: boolean,
        viewDate: Date
    }> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    emitDebounceLastWeekClicked() {
        this.debounceLastWeekClicked.emit({
            viewWeek: this.viewWeek,
            weekChanged: this.weekChanged,
            viewDate: this.viewDate,
        });
    }

    emitDebounceNextWeekClicked() {
        this.debounceNextWeekClicked.emit({
            viewWeek: this.viewWeek,
            weekChanged: this.weekChanged,
            viewDate: this.viewDate,
        });
    }

    getWeekLabel(): string {
        switch (true) {
            // Check if is this week
            case moment(this.viewWeek[0].start).get('week') === moment().get('week'):
                return 'CALENDAR_PAGE.WEEK.CURRENT';
            // Check if is next week
            case moment(this.viewWeek[0].start).get('week') === moment().add(1, 'week').get('week'):
                return 'CALENDAR_PAGE.WEEK.NEXT';
            // Check if is last week
            case moment(this.viewWeek[0].start).get('week') === moment().subtract(1, 'week').get('week'):
                return 'CALENDAR_PAGE.WEEK.PREVIOUS';
            // Otherwise show start and end day of week
            default:
                return moment(
                    this.viewWeek[0].start).startOf('week').format('DD')
                    + ' - ' +
                    moment(this.viewWeek[0].start).endOf('week').format('DD');
        }
    }

    public async setWeek(increment: boolean) {
        this.weekChanged = true;
        if (increment) {
            this.viewWeek = this.viewWeek.map((i) => {
                return {
                    start: moment(i.start).add(1, 'week').toISOString(),
                    end: moment(i.end).add(1, 'week').toISOString(),
                };
            });
            this.viewDate = moment(this.viewDate).add(7, 'd').toDate();
        } else {
            this.viewWeek = this.viewWeek.map((i) => {
                return {
                    start: moment(i.start).subtract(1, 'week').toISOString(),
                    end: moment(i.end).subtract(1, 'week').toISOString(),
                };
            });
            this.viewDate = moment(this.viewDate).subtract(7, 'd').toDate();
        }
    }

}
