import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../../service/auth.service';

@Component({
    selector: 'app-user-menu-popover',
    templateUrl: './user-menu-popover.component.html',
    styleUrls: ['./user-menu-popover.component.scss'],
})
export class UserMenuPopoverComponent implements OnInit {
    @Input() currentLang;

    constructor(public authService: AuthService) {
    }

    ngOnInit() {
    }

    public logout(){
      this.authService.logout();
    }

}
