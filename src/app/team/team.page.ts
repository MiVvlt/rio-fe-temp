import {Component, OnInit} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {TeamService} from '../service/team.service';

@Component({
    selector: 'app-team',
    templateUrl: './team.page.html',
    styleUrls: ['./team.page.scss'],
})
export class TeamPage implements OnInit {
    public teamMembers: any[] = [];

    isIndeterminate: boolean;
    masterCheck: boolean;
    checkBoxList: any = [];
    checkBoxListVisible = false;

    public appointments = [];

    constructor(private menu: MenuController, private teamService: TeamService) {
    }

    async ngOnInit() {
        this.checkBoxList = await this.getTeamMembers();
        this.checkEvent();
        this.checkMaster(null);
    }

    showMenu() {
        this.menu.open();
    }

    async getTeamMembers() {
        return this.teamMembers = (await this.teamService.getTeamMembers()).map((i) => {
            return {...i, isChecked: true};
        });
    }

    getCheckedCheckboxes() {
        return this.checkBoxList.filter((i) => i.isChecked);
    }

    checkMaster(evt) {
        setTimeout(() => {
            this.checkBoxList.forEach(obj => {
                obj.isChecked = this.masterCheck;
            });
        });
    }

    public async teamMembersChanged() {
        this.checkBoxListVisible = false;
        this.appointments = await this.teamService.getAppointmentsByTeamMembers(this.getCheckedCheckboxes().map((i) => i.id));
    }

    checkEvent() {
        const totalItems = this.checkBoxList.length;
        let checked = 0;
        this.checkBoxList.map(obj => {
            if (obj.isChecked) {
                checked++;
            }
        });
        if (checked > 0 && checked < totalItems) {
            // If even one item is checked but not all
            this.isIndeterminate = true;
            this.masterCheck = false;
        } else if (checked === totalItems) {
            // If all are checked
            this.masterCheck = true;
            this.isIndeterminate = false;
        } else {
            // If none is checked
            this.isIndeterminate = false;
            this.masterCheck = false;
        }
    }


}
