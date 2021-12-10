import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarService } from '../service/calendar.service';
import { isNullOrUndefined } from 'util';
import { PickerController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import * as numeral from 'numeral';
import { TranslateService } from '@ngx-translate/core';
import { Color } from '@ionic/core';
import { environment } from '../../environments/environment';
import { KilometersService } from '../service/kilometers.service';
import { SessionEvent } from '../interface/SessionEvent';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';
import { ChangeRequest } from '../interface/ChangeRequest';

@Component({
  selector: 'app-edit-calendar-item',
  templateUrl: './edit-calendar-item.page.html',
  styleUrls: ['./edit-calendar-item.page.scss'],
})
export class EditCalendarItemPage implements OnInit {
  public customerNotified = false;
  public customerNotifiedChanged = false;
  public id;
  private originalKmShopping: number;
  public calendarEvent: SessionEvent;
  @ViewChild('distanceInput', { static: false }) input;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pickerCtrl: PickerController,
    private calendarService: CalendarService,
    private kilometersService: KilometersService,
    private translateService: TranslateService,
    private router: Router,
    public toastController: ToastController
  ) {}

  async ngOnInit() {
    this.id = await this.getId();
    const pendingChangePromise = this.calendarService.getChangeRequest(this.id);
    const calendarEventPromise = this.calendarService.getCalendarEventById(
      this.id
    );
    const kilometersPromise = this.kilometersService.getKilometersByAgendaItem(
      this.id
    );

    this.calendarEvent = await calendarEventPromise;
    try {
      const kilometers = await kilometersPromise;
      this.calendarEvent.shoppingKm = kilometers.kmShopping;
      this.originalKmShopping = kilometers.kmShopping;
    } catch (err) {
      this.calendarEvent.shoppingKm = 0;
      this.originalKmShopping = 0;
    }
    this.calendarEvent.pendingChange = await pendingChangePromise;
    this.customerNotified = this.calendarEvent.clientCommunicated;
  }

  getId(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.activatedRoute.params.subscribe((val) => {
        if (!isNullOrUndefined(val.id)) {
          resolve(val.id);
        } else {
          reject(new Error('Id is undefined'));
        }
      });
    });
  }

  async addDistance() {
    const picker = await this.pickerCtrl.create({
      buttons: [
        {
          text: await this.translateService.get('GENERAL.CANCEL').toPromise(),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            picker.dismiss();
          },
        },
        {
          text: await this.translateService.get('GENERAL.CONFIRM').toPromise(),
          handler: (v) => {
            this.calendarEvent.shoppingKm = v.distance.value;
          },
        },
      ],
      columns: [
        {
          name: 'distance',
          prefix: 'km\'s',
          options: [...Array(99).keys()].map((v) => {
            return { text: `${v + 1}`, value: v + 1 };
          }),
        },
      ],
    });
    await picker.present();
  }

  durationChanged(ev: { start: Date; end: Date }) {
    if (this.calendarEvent) {
      this.calendarEvent.requestedEnd = ev.end;
      this.calendarEvent.requestedStart = ev.start;
    }
  }

  onCustomerNotifiedChange() {
    this.customerNotifiedChanged = true;
  }

  cancel() {
    this.router.navigate(['/menu/calendar/']);
  }

  async submit() {
    const durationLessThan15MinPromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.DURATION_LESS_THAN_15_MIN')
      .toPromise();
    const alreadyValidatedPromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.ALREADY_VALIDATED')
      .toPromise();
    const pendingChangeRequestPromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.PENDING_CHANGE_REQUEST')
      .toPromise();
    const startTimeAfterEndTimePromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.START_TIME_AFTER_END_TIME')
      .toPromise();
    const reasonFilledInOnEmptyDurationPromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.REASON_FILLED_IN_ON_EMPTY_DURATION')
      .toPromise();
    const customerNotifiedFilledInOnEmptyDurationPromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.CUSTOMER_NOTIFIED_FILLED_IN_ON_EMPTY_DURATION')
      .toPromise();
    const noChangesPromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.NO_CHANGES')
      .toPromise();
    const unknowErrorPromise = this.translateService
      .get('EDIT_CALENDAR_ITEM.UNKNOWN_ERROR')
      .toPromise();

    // only await them once all are sent out
    const durationLessThan15Min = await durationLessThan15MinPromise;
    const alreadyValidated = await alreadyValidatedPromise;
    const pendingChangeRequest = await pendingChangeRequestPromise;
    const startTimeAfterEndTime = await startTimeAfterEndTimePromise;
    const reasonFilledInOnEmptyDuration = await reasonFilledInOnEmptyDurationPromise;
    const customerNotifiedFilledInOnEmptyDuration = await customerNotifiedFilledInOnEmptyDurationPromise;
    const noChanges = await noChangesPromise;
    const unknowError = await unknowErrorPromise;

    let flag = false;

    if (this.durationIsUnchanged() && this.reasonHasChanged()) {
      flag = true;
      this.presentToast(reasonFilledInOnEmptyDuration, 'danger');
    }

    if (this.durationIsUnchanged() && this.clientNotifiedHasChanged()) {
      flag = true;
      this.presentToast(customerNotifiedFilledInOnEmptyDuration, 'danger');
    }

    if (!this.kilometersHaveChanged() && this.durationIsUnchanged() && !flag) {
      this.presentToast(noChanges, 'danger');
    }

    if (!this.durationIsUnchanged()) {
      this.calendarService
        .changeCalendarEvent(
          this.calendarEvent.id,
          moment(this.calendarEvent.requestedStart).format(
            environment.apiDateFormat
          ),
          moment(this.calendarEvent.requestedEnd).format(
            environment.apiDateFormat
          ),
          this.calendarEvent.pendingChange.reasonRequest,
          this.customerNotified
        )
        .then(() => {
          this.router.navigate(['/menu/calendar/']);
        })
        .catch((err) => {
          const error: string = err.error.message;
          if ('Duration less than fifteen minutes.' === error) {
            this.presentToast(durationLessThan15Min, 'danger');
          } else if ('The end time must be after the start time.' === error) {
            this.presentToast(startTimeAfterEndTime, 'danger');
          } else if (
            isNotNullOrUndefined(error) &&
            error.includes('Pending change request for agenda item with id')
          ) {
            this.presentToast(pendingChangeRequest, 'danger');
          } else {
            this.presentToast(unknowError, 'danger');
          }
        });
    }

    if (this.kilometersHaveChanged()) {
      const day = moment(this.calendarEvent.start).format('YYYY-MM-DD');
      const shoppingKm = this.calendarEvent.shoppingKm;
      const agendaItemId = this.calendarEvent.id;
      this.kilometersService
        .editKilometersShopping(agendaItemId, day, shoppingKm)
        .then(() => {
          this.router.navigate(['/menu/calendar/']);
        })
        .catch((err) => {
          const error: string = err.error.message;
          if (error.includes('already validated')) {
            this.presentToast(alreadyValidated, 'danger');
          } else {
            this.presentToast(unknowError, 'danger');
          }
        });
    }
  }

  private clientNotifiedHasChanged() {
    return this.customerNotifiedChanged;
  }

  private reasonHasChanged() {
    return (
      (!isNullOrUndefined(this.calendarEvent.reasonChanged) &&
        this.calendarEvent.reasonChanged.length > 0) ||
      (!isNullOrUndefined(this.calendarEvent.pendingChange) &&
        this.calendarEvent.pendingChange.reasonRequest !==
          this.calendarEvent.reasonChanged)
    );
  }

  private durationIsUnchanged() {
    return (
      isNullOrUndefined(this.calendarEvent.requestedStart) &&
      isNullOrUndefined(this.calendarEvent.requestedEnd)
    );
  }

  private kilometersHaveChanged() {
    return (
      !isNullOrUndefined(this.calendarEvent.shoppingKm) &&
      this.calendarEvent.shoppingKm !== this.originalKmShopping
    );
  }

  async presentToast(message: string, color: Color = 'primary') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 5000,
    });
    toast.present();
  }

  public async fieldFocus(): Promise<void> {
    const e = await this.input.getInputElement();
    e.select();
  }
}
