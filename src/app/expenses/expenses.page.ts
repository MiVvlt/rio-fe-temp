import { Component, OnChanges, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
} from '@ionic/angular';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { ExpenseService } from '../service/expense.service';
import { Distance, Expense } from '../interface/Expense';
import { EditExpenseModalComponent } from '../components/edit-expense-modal/edit-expense-modal.component';
import { Router } from '@angular/router';
import { IDistanceDTO } from '../interface/dto';
import { Network } from '@ionic-native/network/ngx';
import { NetworkService } from '../service/network.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.page.html',
  styleUrls: ['./expenses.page.scss'],
})
export class ExpensesPage implements OnInit, OnChanges {
  fromDate: string = moment().startOf('w').toISOString();
  toDate: string = moment().endOf('w').toISOString();
  public expenses: Expense[] = [];
  public distances: Distance[] = [];
  public total = 0;
  public totalKM = 0;

  public activeTab: 'EXPENSES' | 'DISTANCE' = 'EXPENSES';

  constructor(
    private menu: MenuController,
    private loadingController: LoadingController,
    private translateService: TranslateService,
    private router: Router,
    private network: Network,
    private networkService: NetworkService,
    private modalController: ModalController,
    private alertController: AlertController,
    private expenseService: ExpenseService
  ) {}

  ngOnInit() {
    this.networkService.checkNetwork(this.network, this.router);
    this.dateChanged();
  }

  ngOnChanges() {
    this.networkService.checkNetwork(this.network, this.router);
  }

  public showMenu() {
    this.menu.open();
  }

  setRange(range: 'WEEK' | 'MONTH' | 'TODAY') {
    switch (range) {
      case 'MONTH':
        this.fromDate = moment().startOf('month').toISOString();
        this.toDate = moment().endOf('month').toISOString();
        break;
      case 'WEEK':
        this.fromDate = moment().startOf('week').toISOString();
        this.toDate = moment().endOf('week').toISOString();
        break;
      case 'TODAY':
        this.fromDate = moment().startOf('day').toISOString();
        this.toDate = moment().endOf('day').toISOString();
        break;
    }
    return;
  }

  async dateChanged(event?: any) {
    const loading = await this.loadingController.create({
      message: await this.translateService.get('GENERAL.LOADING').toPromise(),
    });
    loading.present();
    try {
      const expensesPromise = await this.expenseService.getExpensesByDates(
        moment(this.fromDate).format('YYYY-MM-DD'),
        moment(this.toDate).format('YYYY-MM-DD')
      );
      const distancesPromise = await this.expenseService.getDistancesByDates(
        moment(this.fromDate).format('YYYY-MM-DD'),
        moment(this.toDate).format('YYYY-MM-DD')
      );

      this.expenses = await expensesPromise;
      this.distances = await distancesPromise;

      this.total = this.expenses
        .map((i) => i.value)
        .reduce((total, val) => total + val, 0);

      this.totalKM = this.distances
        .map(
          (i) =>
            (i.kmCar || 0) +
            (i.kmCarpool || 0) +
            (i.kmMotor || 0) +
            (i.kmScooter || 0) +
            (i.kmWalk || 0) +
            (i.kmPubicTransport || 0) +
            (i.kmBike || 0) +
            (i.kmLeasingBike || 0)
        )
        .reduce((total, val) => total + val, 0);

      loading.dismiss();
    } catch (err) {
      console.error(err);
      loading.dismiss();
    }

    if (event) {
      event.target.complete();
    }
  }

  public tabChanged(ev) {
    this.activeTab = ev.target.value;
    this.dateChanged();
  }

  public async confirmDeleteExpense(item: Expense) {
    const confirm = await this.alertController.create({
      message: await this.translateService
        .get('CONFIRMATION_MESSAGES.DELETE_EXPENSE')
        .toPromise(),
      buttons: [
        {
          handler: async () => {
            await this.expenseService.delete(item.id).then((result) => {
              this.dateChanged();
            });
            this.alertController.dismiss();
          },
          text: await this.translateService.get('GENERAL.CONFIRM').toPromise(),
        },
        {
          handler: async () => {
            this.alertController.dismiss();
          },
          role: 'cancel',
          text: await this.translateService.get('GENERAL.CANCEL').toPromise(),
        },
      ],
    });

    confirm.present();
  }

  public async editExpense(expense: Expense) {
    const m = await this.modalController.create({
      component: EditExpenseModalComponent,
      componentProps: { expense },
    });

    m.present();
    m.onDidDismiss().then(async (d) => {
      if (d.data) {
        this.dateChanged();
      }
    });
  }
}
