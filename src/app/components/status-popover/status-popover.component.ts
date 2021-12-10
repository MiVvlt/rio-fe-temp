import {Component, Input, OnInit} from '@angular/core';
import {SessionEventStatus} from '../../interface/SessionEvent';

@Component({
    selector: 'app-status-popover',
    templateUrl: './status-popover.component.html',
    styleUrls: ['./status-popover.component.scss'],
})
export class StatusPopoverComponent implements OnInit {
    @Input() status: SessionEventStatus;

    constructor() {
    }

    ngOnInit() {
    }

}
