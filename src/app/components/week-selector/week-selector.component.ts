import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {environment} from '../../../environments/environment';

@Component({
    selector: 'app-week-selector',
    templateUrl: './week-selector.component.html',
    styleUrls: ['./week-selector.component.scss'],
})
export class WeekSelectorComponent implements OnInit {

    @Input() dates: { start: string, end: string };
    @Output() nextWeekClicked: EventEmitter<void> = new EventEmitter();
    @Output() debounceNextWeekClicked: EventEmitter<void> = new EventEmitter();
    @Output() lastWeekClicked: EventEmitter<void> = new EventEmitter();
    @Output() debounceLastWeekClicked: EventEmitter<void> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }

    emitDebounceLastWeekClicked() {
        this.debounceLastWeekClicked.emit();
    }

    emitDebounceNextWeekClicked() {
        this.debounceNextWeekClicked.emit();
    }

    setWeek(next: boolean) {
        if (next) {
            this.dates.start =
                moment(this.dates.start).add(1, 'w').startOf('w').format(environment.apiDateFormat);
            this.dates.end =
                moment(this.dates.end).add(1, 'w').endOf('w').format(environment.apiDateFormat);
        } else {
            this.dates.start =
                moment(this.dates.start).subtract(1, 'w').startOf('w').format(environment.apiDateFormat);
            this.dates.end =
                moment(this.dates.end).subtract(1, 'w').endOf('w').format(environment.apiDateFormat);
        }
    }

    getWeekNumber(d: string) {
        return moment(d).format('ww');
    }

}
