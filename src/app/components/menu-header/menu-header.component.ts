import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-menu-header',
    templateUrl: './menu-header.component.html',
    styleUrls: ['./menu-header.component.scss'],
})
export class MenuHeaderComponent {
    @Input() avatarUrl = '';
    @Input() name = '';
    @Output() avatarClicked: EventEmitter<void> = new EventEmitter();
    @Output() nameClicked: EventEmitter<void> = new EventEmitter();

    constructor() {
    }

}
