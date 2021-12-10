import {Component, Input, OnInit} from '@angular/core';
import {IonicIcon} from '../../interface/ionic-icon';
import {Router} from '@angular/router';

@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss'],
})
export class MenuItemComponent implements OnInit {
    @Input() icon: IonicIcon;
    @Input() label: string;
    @Input() active: string;

    constructor(public router: Router) {
    }

    ngOnInit() {
    }

    isActive(): boolean {
        return this.router.isActive(this.active, false);
    }

}



