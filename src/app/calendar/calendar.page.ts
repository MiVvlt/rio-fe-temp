import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import {
  AlertController,
  MenuController,
  ModalController,
  PopoverController,
  ToastController,
} from '@ionic/angular';
import { CreateDistanceModalComponent } from '../components/create-distance-modal/create-distance-modal.component';
import { CreateTravelTimeModalComponent } from '../components/create-travel-time-modal/create-travel-time-modal.component';
import {
  Router,
  RouterEvent,
  NavigationEnd,
  ActivatedRoute,
} from '@angular/router';
import { CalendarService } from '../service/calendar.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SessionEvent } from '../interface/SessionEvent';
import { ValidateAllModalComponent } from '../components/validate-all-modal/validate-all-modal.component';
import { Color } from '@ionic/core';
import { NotificationsPopoverComponent } from '../components/notifications-popover/notifications-popover.component';
import { environment } from '../../environments/environment';
import { ExpenseService } from '../service/expense.service';
import { Kilometers } from '../interface/kilometers';
import { KilometersService } from '../service/kilometers.service';
import { TravelRequest } from '../interface/TravelRequest';
import { TravelService } from '../service/travel.service';
import { filter } from 'rxjs/operators';
import { ValidateCalendarItemModalComponent } from '../components/validate-calendar-item-modal/validate-calendar-item-modal.component';
import { NotificationService } from '../service/notification.service';
import { MessagingService } from '../modules/messaging/services/messaging.service';
import { Message } from '../modules/messaging/models/Message';
import { MessageType } from '../modules/messaging/models/MessageType';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';

export interface ViewWeekItem {
  start: string;
  end: string;
}

export interface WeekChangeEvent {
  viewWeek: ViewWeekItem[];
  weekChanged: boolean;
  viewDate: Date;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit, OnDestroy {
  // calendar properties
  public refresh: Subject<any> = new Subject();
  public view: CalendarView = CalendarView.Day;
  public viewDate: Date = new Date();
  public weekChanged = false;
  public viewWeek: ViewWeekItem[] = [];
  public today: { start: number; end: number } = {
    start: 23,
    end: 0,
  };

  // events
  public events: SessionEvent[] = [];
  public loading = false;

  // notifications
  public notificationsAmount = 0;

  // Distance
  public kms = 0;
  public distanceLoading = false;

  //  expenses
  public expensesTotal = 0;
  public expenses = [];
  public expensesLoading = false;

  // subscriptions
  public messageSubscription;

  constructor(
    private menu: MenuController,
    private router: Router,
    private calendarService: CalendarService,
    private translateService: TranslateService,
    public notificationService: NotificationService,
    public toastController: ToastController,
    public popoverController: PopoverController,
    public expenseService: ExpenseService,
    public messagingService: MessagingService,
    public modalController: ModalController,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private kilometersService: KilometersService,
    private travelService: TravelService
  ) {
    // init viewWeek
    this.viewWeek = this.initViewWeek();
  }

  public ionViewDidEnter() {
    this.fetchData();
  }

  public ngOnInit() {
    this.messageSubscription = this.messagingService.messageEmitter.subscribe(
      (message: Message) => {
        if (
          isNotNullOrUndefined(message) &&
          [
            MessageType.REFRESH,
            MessageType.PLANNINGPUSH,
            MessageType.CHANGEPUSH,
            MessageType.LOCK,
            MessageType.CHANGEREQUEST,
          ].indexOf(message.type) !== -1
        ) {
          this.fetchData();
        }
      }
    );

    this.router.events
      .pipe(filter((event: RouterEvent) => event instanceof NavigationEnd))
      .subscribe(this.fetchData);
  }

  public ngOnDestroy() {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }
  }

  public async openNotifications(ev) {
    const popover = await this.popoverController.create({
      component: NotificationsPopoverComponent,
      event: ev,
      cssClass: 'notifications-container',
      componentProps: {
        notificationsAmount: await this.fetchNotificationsAmount(),
      },
    });
    await popover.present();
    return popover.onDidDismiss().then(() => {
      this.fetchNotificationsAmount();
    });
  }

  public getStartAndEndHour() {
    this.events
      .filter((item) => {
        // Get today's items only
        return item.start.getDay() === this.viewDate.getDay();
      })
      .forEach((item) => {
        if (item.start.getHours() < this.today.start) {
          this.today.start = item.start.getHours() - 1;
        }
        if (item.end.getHours() > this.today.end) {
          this.today.end = item.end.getHours() + 1;
        }

        if (this.today.start < 0) {
          this.today.start = 0;
        }
        if (this.today.end > 23) {
          this.today.end = 23;
        }
      });
    this.refresh.next();
  }

  public fetchData(): void {
    try {
      this.refreshEvents();
      this.refreshExpenses();
      this.refreshKilometers();
      this.fetchNotificationsAmount();
      this.refresh.next();
    } catch (err) {}
  }

  public async fetchNotificationsAmount(): Promise<number> {
    try {
      this.notificationsAmount = await this.notificationService.getPushNotificationsAmount();
      return this.notificationsAmount;
    } catch (err) {
      this.notificationsAmount = 0;
    }
  }

  public refreshExpenses() {
    this.expensesLoading = true;
    this.expenseService
      .getExpensesByDate(moment(this.viewDate).format('YYYY-MM-DD'))
      .toPromise()
      .finally(() => {
        this.expensesLoading = false;
        this.refresh.next();
      })
      .then((result) => {
        this.expenses = result;
        this.expensesTotal = this.getExpensesTotalForActiveViewDate();
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  public refreshKilometers() {
    this.distanceLoading = true;
    this.kilometersService
      .getKilometersByDate(moment(this.viewDate).format('YYYY-MM-DD'))
      .finally(() => {
        this.distanceLoading = false;
        this.refresh.next();
      })
      .then((result) => {
        const LEASINGFIETS = result.LEASINGFIETS ? result.LEASINGFIETS : 0;
        this.kms =
          result.AUTO +
          result.BROMFIETS +
          result.CARPOOL +
          result.MOTO +
          result.OPENBAAR_VERVOER +
          result.FIETS +
          LEASINGFIETS;
        this.kms = +this.kms.toFixed(2);
      })
      .catch((err) => {
        this.handleError(err);
        this.kms = 0;
      });
  }

  public async refreshEvents(event?) {
    this.loading = true;
    if (this.weekChanged) {
      this.weekChanged = false;
    }
    try {
      this.events = await this.calendarService.getCalendarEvents(
        moment(this.viewDate).startOf('w').format(environment.apiDateFormat),
        moment(this.viewDate).endOf('w').format(environment.apiDateFormat)
      );
      this.getStartAndEndHour();
      this.loading = false;
      this.refresh.next();
      if (event) {
        event.target.complete();
      }
    } catch (err) {
      this.loading = false;
      this.refresh.next();
      this.handleError(err);
      if (event) {
        event.target.complete();
      }
    }
  }

  public getExpensesTotalForActiveViewDate() {
    let e = 0;
    this.expenses
      .filter((item) => {
        return (
          item.dayOfWeek === parseInt(moment(this.viewDate).format('e'), 10)
        );
      })
      .map((item) => {
        return item.value;
      })
      .forEach((v) => {
        e += v;
      });
    return e;
  }

  public async submitAll() {
    const m = await this.modalController.create({
      component: ValidateAllModalComponent,
    });

    await m.present();

    m.onDidDismiss().then(async (result) => {
      if (isNotNullOrUndefined(result.data.length) && result.data.length) {
        this.loading = true;
        await this.calendarService
          .validateMultipleCalendarEvents(
            SessionEvent.createIdArray(result.data)
          )
          .catch(async (err) => {
            if (
              isNotNullOrUndefined(err.error.message) &&
              err.error.message.includes('overlaps')
            ) {
              await this.presentToast(
                await this.translateService
                  .get('ERROR_MESSAGES.OVERLAP_ERROR')
                  .toPromise(),
                'danger',
                true
              );
            }
          });
      }
      this.refreshEvents();
    });
  }

  public showEventDetails(event: SessionEvent) {
    this.router.navigate(['/menu/calendar/' + event.id]);
  }

  async validateEvent(event: SessionEvent) {
    const modal = await this.modalController.create({
      component: ValidateCalendarItemModalComponent,
      componentProps: { calendarEvent: event },
    });

    await modal.present();

    modal.onDidDismiss().then(async (value) => {
      if (value.data) {
        try {
          await this.calendarService.validateCalendarEvent(
            event,
            value.data.rosterDisturbance
          );
          this.refreshEvents();
        } catch (err) {
          try {
            if (
              isNotNullOrUndefined(err.error.message) &&
              err.error.message.startsWith('OVERLAP_ABSENCE_ERROR')
            ) {
              const a = await this.alertController.create({
                message: await this.translateService
                  .get('ERROR_MESSAGES.OVERLAP_ABSENCE_ERROR')
                  .toPromise(),
                buttons: [
                  {
                    text: await this.translateService
                      .get('GENERAL.CONFIRM')
                      .toPromise(),
                  },
                  {
                    text: await this.translateService
                      .get('GENERAL.FORCE')
                      .toPromise(),
                    handler: async () => {
                      await this.calendarService
                        .validateCalendarEvent(
                          event,
                          value.data.rosterDisturbance,
                          true
                        )
                        .finally(() => {
                          this.refreshEvents();
                        })
                        .catch(async (err) => {
                          if (err.error.message.startsWith('OVERLAP_ERROR')) {
                            this.presentToast(
                              await this.translateService
                                .get('ERROR_MESSAGES.OVERLAP_ERROR')
                                .toPromise(),
                              'danger',
                              true
                            );
                          }
                        });
                    },
                  },
                ],
              });
              a.present();
            } else if (err.error.message.startsWith('OVERLAP_ERROR')) {
              this.presentToast(
                await this.translateService
                  .get('ERROR_MESSAGES.OVERLAP_ERROR')
                  .toPromise(),
                'danger',
                true
              );
            } else {
              console.error(err);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
    });

    return true;
  }

  async editEvent(event: SessionEvent) {
    try {
      await this.router.navigate([`/menu/calendar/edit/${event.id}`]);
    } catch (err) {
      console.error(err);
    }
  }

  async editAbsenceEvent(event: SessionEvent) {
    this.router.navigate([`/menu/calendar/edit-absence/${event.id}`]);
  }

  public async deleteEvent(event: {
    event: SessionEvent;
    reason;
    customerRequested;
  }) {
    if (
      (event.reason && event.reason.length > 0) ||
      event.event.type === 'REISTIJD'
    ) {
      await this.calendarService.deleteCalendarEvent(
        event.event,
        event.reason,
        event.customerRequested
      );
      this.presentToast(
        await this.translateService
          .get('CONFIRMATION_MESSAGES.SUCCESFULLY_REQUESTED_DELETION')
          .toPromise(),
        'success'
      );
      this.refreshEvents();
    }
  }

  public async toggleCommunicated(event: SessionEvent) {
    if (event.clientCommunicated === false) {
      const confirm = await this.translateService
        .get('GENERAL.CONFIRM')
        .toPromise();
      const a = await this.alertController.create({
        message: await this.translateService
          .get(
            'CALENDAR_ITEM.CONFIRM_COMMUNICATED_' +
              event.clientCommunicated.toString().toUpperCase()
          )
          .toPromise(),
        header: confirm,
        buttons: [
          {
            text: confirm,
            handler: async () => {
              try {
                await this.calendarService.updateClientNotified(
                  [event.id],
                  !event.clientCommunicated
                );
                this.refreshEvents();
              } catch (err) {
                await this.handleError(err);
              }
            },
          },
          {
            text: await this.translateService.get('GENERAL.CANCEL').toPromise(),
            handler: () => {
              return;
            },
          },
        ],
      });
      a.present();
    }
  }

  public showMenu() {
    this.menu.open();
  }

  public async addSupplement(supplement: 'distance' | 'travelTime') {
    let modal;
    let kilometers: Kilometers;
    try {
      kilometers = await this.kilometersService.getKilometersByDate(
        moment(this.viewDate).format('YYYY-MM-DD')
      );
    } catch (err) {
      this.handleError(err);
    }
    switch (supplement) {
      case 'distance':
        modal = await this.modalController.create({
          component: CreateDistanceModalComponent,
          componentProps: {
            values: {
              shopping: kilometers == null ? null : kilometers.kmShopping,
              AUTO: kilometers.AUTO,
              BROMFIETS: kilometers.BROMFIETS,
              CARPOOL: kilometers.CARPOOL,
              MOTO: kilometers.MOTO,
              OPENBAAR_VERVOER: kilometers.OPENBAAR_VERVOER,
              FIETS: kilometers.FIETS,
              LEASINGFIETS: kilometers.LEASINGFIETS,
            },
            day: this.viewDate,
          },
        });
        modal.onDidDismiss().then(async (result) => {
          if (
            result.data !== undefined &&
            result.data.type !== 'OVERIGE_HULPBEURT'
          ) {
            const body = {
              day: moment(this.viewDate).format('YYYY-MM-DD'),
              type: result.data.type,
              value: result.data.values[result.data.type],
            };

            await this.kilometersService
              .addKilometers(body)
              .then(() => {
                this.refreshKilometers();
              })
              .catch((err) => {
                if (
                  isNotNullOrUndefined(err.error.message) &&
                  err.error.message.includes('already exist.')
                ) {
                  this.kilometersService.editKilometers(body).then(() => {
                    this.refreshKilometers();
                  });
                } else {
                  console.error(err);
                }
              });
          } else if (
            isNotNullOrUndefined(result.data) &&
            result.data.type === 'OVERIGE_HULPBEURT'
          ) {
            this.presentToast(
              await this.translateService
                .get('ERROR_MESSAGES.KMS_OVERIGE_HULPBEURT_NOT_ALLOWED')
                .toPromise(),
              'danger'
            );
          }
        });
        break;

      case 'travelTime':
        modal = await this.modalController.create({
          component: CreateTravelTimeModalComponent,
          componentProps: {
            day: this.viewDate,
          },
        });

        modal.onDidDismiss().then(async (result) => {
          if (
            isNotNullOrUndefined(result) &&
            isNotNullOrUndefined(result.data)
          ) {
            const travelRequest = new TravelRequest(
              result.data.start,
              result.data.end,
              moment(this.viewDate).format('YYYY-MM-DD')
            );
            await this.travelService.addTravel(travelRequest);
            this.refreshEvents();
          }
        });
        break;
    }
    await modal.present();
  }

  public isActive(isoDate: string) {
    return moment(this.viewDate).startOf('d').toISOString() === isoDate;
  }

  public isToday(isoDate: string) {
    return !!!moment(isoDate).diff(moment().startOf('d'));
  }

  public setActiveDay(isoDate: string) {
    this.viewDate = new Date(isoDate);
    if (this.weekChanged) {
      this.refreshEvents();
    }
    this.refreshExpenses();
    this.refreshKilometers();
    this.getStartAndEndHour();
    this.refresh.next();
  }

  public async openExpensesModal() {
    const props = {
      date: this.viewDate,
      expenses: this.expenses.filter((i) => {
        return i.dayOfWeek === parseInt(moment(this.viewDate).format('e'), 10);
      }),
    };

    this.router.navigate(['/menu/calendar/expensemodal'], { state: props });
  }

  public async presentToast(
    message: string,
    color: Color = 'primary',
    dismissable: boolean = false
  ) {
    const toast = await this.toastController.create({
      message,
      color,
      showCloseButton: dismissable,
      closeButtonText: await this.translateService
        .get('GENERAL.CLOSE')
        .toPromise(),
      duration: dismissable ? undefined : 1500,
    });
    toast.present();
  }

  public isDeviceOnline() {
    return localStorage.getItem('device-offline') === 'false';
  }

  public async refreshAll() {
    await this.refreshEvents();
    await this.refreshExpenses();
    await this.refreshKilometers();
  }

  public onWeekChange(evt: WeekChangeEvent) {
    this.viewWeek = evt.viewWeek;
    this.weekChanged = evt.weekChanged;
    this.viewDate = evt.viewDate;

    this.refreshAll();
  }

  private async handleError(err): Promise<void> {
    let message;
    console.error(err);
    if (err) {
      switch (err.statusText) {
        case 'Not Found':
          message = await this.translateService
            .get('ERROR_MESSAGES.NOT_FOUND')
            .toPromise();
          break;
        case 'Unauthorised':
          message = await this.translateService
            .get('ERROR_MESSAGES.UNAUTHORIZED')
            .toPromise();
          break;
        case undefined:
          message = '';
          return;
        default:
          message = await this.translateService
            .get('ERROR_MESSAGES.GENERIC')
            .toPromise();
      }
    } else {
      console.error(err);
      message = await this.translateService
        .get('ERROR_MESSAGES.GENERIC')
        .toPromise();
    }

    this.presentToast(message, 'danger', true);
  }

  public initViewWeek(): ViewWeekItem[] {
    return [
      {
        start: moment().startOf('week').startOf('day').toISOString(),
        end: moment().startOf('week').endOf('day').toISOString(),
      },
      {
        start: moment()
          .startOf('week')
          .add(1, 'day')
          .startOf('day')
          .toISOString(),
        end: moment().startOf('week').add(1, 'day').endOf('day').toISOString(),
      },
      {
        start: moment()
          .startOf('week')
          .add(2, 'days')
          .startOf('day')
          .toISOString(),
        end: moment().startOf('week').add(2, 'days').endOf('day').toISOString(),
      },
      {
        start: moment()
          .startOf('week')
          .add(3, 'days')
          .startOf('day')
          .toISOString(),
        end: moment().startOf('week').add(3, 'days').endOf('day').toISOString(),
      },
      {
        start: moment()
          .startOf('week')
          .add(4, 'days')
          .startOf('day')
          .toISOString(),
        end: moment().startOf('week').add(4, 'days').endOf('day').toISOString(),
      },
      {
        start: moment()
          .startOf('week')
          .add(5, 'days')
          .startOf('day')
          .toISOString(),
        end: moment().startOf('week').add(5, 'days').endOf('day').toISOString(),
      },
      {
        start: moment()
          .startOf('week')
          .add(6, 'days')
          .startOf('day')
          .toISOString(),
        end: moment().startOf('week').add(6, 'days').endOf('day').toISOString(),
      },
    ];
  }
}
