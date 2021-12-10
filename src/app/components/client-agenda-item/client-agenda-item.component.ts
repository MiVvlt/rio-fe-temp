import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SessionEvent} from '../../interface/SessionEvent';
import {ActionSheetController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {ActionSheetButton} from '@ionic/core/dist/types/components/action-sheet/action-sheet-interface';


@Component({
    selector: 'app-client-agenda-item',
    templateUrl: './client-agenda-item.component.html',
    styleUrls: ['./client-agenda-item.component.scss'],
})
export class ClientAgendaItemComponent implements OnInit {
    @Input() sessionEvent: SessionEvent;
    @Output() showDetails: EventEmitter<SessionEvent> = new EventEmitter<SessionEvent>();
    @Output() toggleCommunicated: EventEmitter<SessionEvent> = new EventEmitter<SessionEvent>();

    public title: string;

    constructor(private translateService: TranslateService,
                private actionSheetController: ActionSheetController) {
    }

    ngOnInit() {
    }

    public async showItemOptions() {
        try {
            const buttons: ActionSheetButton[] = [{
                text: await this.translateService.get('GENERAL.DETAILS').toPromise(),
                handler: () => {
                    this.showDetails.emit(this.sessionEvent);
                }
            }];

            if (['HULPBEURT', 'MEELOPERTAAK', 'NOAH', 'NOAH_KLANT'].indexOf(this.sessionEvent.type) !== -1) {
                buttons.push({
                    text: await this.translateService
                        .get('GENERAL.COMMUNICATED')
                        .toPromise(),
                    handler: () => {
                        this.toggleCommunicated.emit(this.sessionEvent);
                    },
                    cssClass: 'action-sheet-end-icon communicated-' + this.sessionEvent.clientCommunicated.toString().toUpperCase(),
                    icon: this.sessionEvent.clientCommunicated ? 'checkmark' : 'close'
                });
            }
            const a = await this.actionSheetController.create(
                {
                    header: (this.sessionEvent.type === 'HULPBEURT' || this.sessionEvent.type === 'NOAH_VERVOER')
                        ? this.sessionEvent.client.fullName
                        : await this.translateService.get('SESSION_TYPE.' + this.sessionEvent.type).toPromise(),
                    buttons
                }
            );

            await a.present();
        } catch (err) {
            console.log(err);
        }

    }

}
