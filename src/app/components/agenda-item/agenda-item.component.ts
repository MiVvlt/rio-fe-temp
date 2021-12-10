import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SessionEvent, SessionEventStatus} from '../../interface/SessionEvent';
import {ActionSheetButton} from '@ionic/core/dist/types/components/action-sheet/action-sheet-interface';
import {TranslateService} from '@ngx-translate/core';
import {DeletionReasonModalComponent} from '../deletion-reason-modal/deletion-reason-modal.component';
import {ActionSheetController, AlertController, ModalController} from '@ionic/angular';

@Component({
    selector: 'app-agenda-item',
    templateUrl: './agenda-item.component.html',
    styleUrls: ['./agenda-item.component.scss'],
})
export class AgendaItemComponent {
    @Input() sessionEvent: SessionEvent;
    @Input() noActions: boolean;
    @Input() showReasonChanged: boolean;
    @Input() showDate: boolean;
    @Input() showDuration: boolean;
    @Output() showDetails: EventEmitter<SessionEvent> = new EventEmitter<SessionEvent>();
    @Output() validateEvent: EventEmitter<SessionEvent> = new EventEmitter<SessionEvent>();
    @Output() editEvent: EventEmitter<SessionEvent> = new EventEmitter<SessionEvent>();
    @Output() editAbsenceEvent: EventEmitter<SessionEvent> = new EventEmitter<SessionEvent>();
    @Output() toggleCommunicated: EventEmitter<SessionEvent> = new EventEmitter<SessionEvent>();
    @Output() deleteEvent:
        EventEmitter<{ event: SessionEvent, reason: string, customerRequested: boolean }> =
        new EventEmitter<{ event: SessionEvent, reason: string, customerRequested: boolean }>();

    constructor(private translateService: TranslateService,
                private modalController: ModalController,
                private alertController: AlertController,
                private actionSheetController: ActionSheetController
    ) {
    }

    async agendaItemClicked() {
        const isTravel = this.sessionEvent.type === 'REISTIJD';

        if (!this.isDeviceOnline() || this.noActions) {
            return;
        }
        try {
            const buttons: ActionSheetButton[] = [{
                text: await this.translateService.get('GENERAL.DETAILS').toPromise(),
                handler: () => {
                    this.showDetails.emit(this.sessionEvent);
                }
            }];

            if (this.sessionEvent.canValidate && !this.sessionEvent.isNoahBackup) {
                buttons.push({
                    text: await this.translateService.get('GENERAL.VALIDATE').toPromise(),
                    handler: () => {
                        this.validateEvent.emit(this.sessionEvent);
                    }
                });
            }

            if (this.sessionEvent.type !== 'AFWEZIGHEID' && this.sessionEvent.isEditable) {
                buttons.push({
                    text: await this.translateService.get('GENERAL.EDIT').toPromise(),
                    handler: () => {
                        this.editEvent.emit(this.sessionEvent);
                    }
                });
            }

            if (this.sessionEvent.type === 'AFWEZIGHEID' && this.sessionEvent.isEditable) {
                buttons.push({
                    text: await this.translateService.get('GENERAL.EDIT').toPromise(),
                    handler: () => {
                        this.editAbsenceEvent.emit(this.sessionEvent);
                    }
                });
            }

            if (this.sessionEvent.isRemovable) {
                buttons.push({
                    text: await this.translateService.get('GENERAL.DELETE').toPromise(),
                    role: 'destructive',
                    handler: async () => {
                        let c;
                        if (isTravel) {
                            c = await this.confirmDeletion('CONFIRMATION_MESSAGES.DELETE_TRAVEL_SESSION');
                        } else {
                            c = await this.confirmDeletion('CONFIRMATION_MESSAGES.DELETE_CALENDAR_SESSION');
                        }

                        // @ts-ignore
                        if (c && !isTravel) {
                            const details = await this.getDeletionDetails();
                            if (details) {
                                this.deleteEvent.emit({
                                    event: this.sessionEvent,
                                    reason: details.data,
                                    customerRequested: details.role
                                });
                            }
                        } else if (c) {
                            this.deleteEvent.emit({
                                event: this.sessionEvent,
                                reason: '',
                                customerRequested: false
                            });
                        }
                        return true;
                    }
                });
            }

            if (this.sessionEvent.canCommunicate()) {
                buttons.push({
                    text: await this.translateService
                        .get('GENERAL.COMMUNICATED')
                        .toPromise(),
                    handler: () => {
                        this.toggleCommunicated.emit(this.sessionEvent);
                    },
                    cssClass: 'action-sheet-end-icon communicated-' + this.sessionEvent.clientCommunicated.toString().toUpperCase(),
                    icon: this.sessionEvent.clientCommunicated ? 'checkmark' : 'close',
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

    getIcon(status: SessionEventStatus): string {
        switch (status) {
            case 'LOCKED':
                return 'lock';
            case 'VALIDATED':
                return 'send';
            case 'DEFINITE':
                return 'checkmark';
            case 'CHANGED':
                return 'swap';
            case 'NEW':
                return 'alert';
            default:
                return '';
        }
    }

    getDeletionDetails(): Promise<any> {
        return new Promise(async (resolve) => {
            const m = await this.modalController.create({
                component: DeletionReasonModalComponent
            });
            await m.present();

            m.onDidDismiss().then((result) => {
                resolve(result);
            });

        });
    }

    private confirmDeletion(messageKey: string) {
        return new Promise(async (resolve) => {
            try {
                const message = await this.translateService.get(messageKey).toPromise();
                const header = await this.translateService.get('GENERAL.CONFIRM').toPromise();
                const cancel = await this.translateService.get('GENERAL.CANCEL').toPromise();
                const submit = await this.translateService.get('GENERAL.CONFIRM').toPromise();
                const m = await this.alertController.create({
                    header,
                    message,
                    buttons: [
                        {
                            text: cancel,
                            role: 'cancel',
                            cssClass: 'secondary',
                            handler: () => {
                                resolve(false);
                            }
                        }, {
                            text: submit,
                            handler: () => {
                                resolve(true);
                            }
                        }
                    ]
                });
                m.present();
            } catch (err) {
                console.log(err);
            }
        });
    }

    isDeviceOnline() {
        return localStorage.getItem('device-offline') === 'false';
    }
}
