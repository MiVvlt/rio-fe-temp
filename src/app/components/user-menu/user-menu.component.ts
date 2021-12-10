import {Component, OnInit} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {UserMenuPopoverComponent} from './user-menu-popover/user-menu-popover.component';

@Component({
    selector: 'app-user-menu',
    templateUrl: './user-menu.component.html',
    styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit {

    constructor(
        public popoverController: PopoverController,
        public translateService: TranslateService,
    ) {
    }

    ngOnInit() {


    }

    async openUserMenu(ev) {
        const popover = await this.popoverController.create({
            component: UserMenuPopoverComponent,
            componentProps: {
                currentLang: this.translateService.currentLang,
            },
            event: ev
        });
        return await popover.present();
    }

    changeLanguage(lang: 'nl' | 'fr' | 'en') {
        this.translateService.use(lang);
        this.popoverController.dismiss();
    }

}
