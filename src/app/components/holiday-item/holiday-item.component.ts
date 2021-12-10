import {Component, Input, OnInit} from '@angular/core';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
    selector: 'app-holiday-item',
    templateUrl: './holiday-item.component.html',
    styleUrls: ['./holiday-item.component.scss'],
})
export class HolidayItemComponent implements OnInit {

    @Input() holidayItem: {
        id: string;
        holidayType: string;
        start: Date;
        end: Date;
    };

    constructor() {
    }

    ngOnInit() {
    }

    itemClicked() {
        console.log('holiday item clicked');
    }

}
