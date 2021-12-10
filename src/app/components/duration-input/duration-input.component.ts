import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import * as numeral from 'numeral';
import {PickerController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-duration-input',
    templateUrl: './duration-input.component.html',
    styleUrls: ['./duration-input.component.scss'],
})
export class DurationInputComponent {
    @Input() translatePlaceholder;
    @Input() color;
    @Input() start: Date;
    @Input() end: Date;
    @Input() fill: string;
    @Input() expand: string;
    @Input() size: string;

    @Output() change: EventEmitter<{ start: Date, end: Date }> = new EventEmitter();

    constructor(private pickerCtrl: PickerController, public translateService: TranslateService) {
    }

    async changeDuration() {
        if (!this.start) {
            this.start = moment().set('m', Math.round((moment().minutes() / 15)) * 15).toDate();
        }
        if (!this.end) {
            this.end = moment(this.start).add(15, 'm').toDate();
        }

        const hours = [...Array(24).keys()].map((v) => {
            return {
                text: `${numeral(v).format('00')}`,
                value: v,
            };
        });

        const minutes = [...Array(60 / 15).keys()].map((v) => {
            return {
                text: `${numeral(v * 15).format('00')}`,
                value: v * 15,
            };
        });

        const times = [];
        hours.forEach((hour) => {
            minutes.forEach((minute) => {
                times.push({
                    text: `${hour.text}:${minute.text}`,
                    value: {hour: hour.value, minute: minute.value}
                });
            });
        });

        const timeCols = [
            {
                name: 'start',
                prefix: await this.translateService.get('GENERAL.FROM').toPromise(),
                selectedIndex: times.findIndex((item) => {
                    return (
                        item.value.hour === moment(this.start).get('hours') &&
                        item.value.minute === moment(this.start).get('minutes')
                    );
                }),
                options: [...times],
            },
            {
                name: 'end',
                prefix: await this.translateService.get('GENERAL.TO').toPromise(),
                selectedIndex: times.findIndex((item) => {
                    return (
                        item.value.hour === moment(this.end).get('hours') &&
                        item.value.minute === moment(this.end).get('minutes')
                    );
                }),
                options: [...times],
            },

        ];

        function getHour(time: any): number {
            return time.text.split(':', 2)[0];
        }

        function getMinute(time: any): number {
            return time.text.split(':', 2)[1];
        }

        const picker = await this.pickerCtrl.create({

            buttons: [{
                text: await this.translateService.get('GENERAL.CANCEL').toPromise(),
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                    picker.dismiss();
                }
            }, {
                text: await this.translateService.get('GENERAL.CONFIRM').toPromise(),
                handler: (v) => {
                    let requestedStart = this.start;
                    let requestedEnd = this.end;
                    requestedStart =
                        moment(requestedStart)
                            .set('hour', getHour(v.start))
                            .set('minutes', getMinute(v.start))
                            .set('seconds', 0).set('millisecond', 0).toDate();
                    requestedEnd =
                        moment(requestedEnd)
                            .set('hour', getHour(v.end))
                            .set('minutes', getMinute(v.end))
                            .set('seconds', 0).set('millisecond', 0).toDate();

                    this.change.emit({start: requestedStart, end: requestedEnd});
                }
            }],
            columns: [...timeCols]
        });
        await picker.present();
    }

}
