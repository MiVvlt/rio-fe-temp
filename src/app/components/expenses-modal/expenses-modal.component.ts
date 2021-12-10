import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {IonInput, ModalController, ToastController} from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
import {Expense} from '../../interface/Expense';
import {ExpenseService} from '../../service/expense.service';
import * as moment from 'moment';
import {Color} from '@ionic/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

export type ExpenseType =
    'ROSTER_DISTURBANCE_6'
    | 'ROSTER_DISTURBANCE_12'
    | 'ROSTER_DISTURBANCE_15'
    | 'ON_CALL'
    | 'PARKING'
    | 'PUBLIC_TRANSPORT'
    | 'CLOTHING'
    | 'VACCINATION'
    | 'OTHER';

export const EXPENSE_TYPES: ExpenseType[] = [
    'ROSTER_DISTURBANCE_6',
    'ROSTER_DISTURBANCE_12',
    'ROSTER_DISTURBANCE_15',
    'ON_CALL',
    'PARKING',
    'PUBLIC_TRANSPORT',
    'CLOTHING',
    'VACCINATION',
    'OTHER',
];

@Component({
    selector: 'app-expenses-modal',
    templateUrl: './expenses-modal.component.html',
    styleUrls: ['./expenses-modal.component.scss'],
})
export class ExpensesModalComponent implements OnInit, OnChanges {
    date: Date;
    expenses: Expense[] = [];
    @ViewChild('amountInput', {static: true}) amountInput: IonInput;

    expenseTypes = EXPENSE_TYPES;

    expenseForm: FormGroup;

    loading = false;

    constructor(
        public toastController: ToastController,
        private translateService: TranslateService,
        private expenseService: ExpenseService,
        private fb: FormBuilder,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.date = this.router.getCurrentNavigation().extras.state.date;
        this.expenses = this.router.getCurrentNavigation().extras.state.expenses;
        this.setForm();
        this.refreshData();
    }

    refreshData() {
        this.loading = true;
        this.expenseService.getExpensesByDate(moment(this.date).format('YYYY-MM-DD'))
            .subscribe((result) => {
                this.expenses = result;
                this.loading = false;
            });
    }

    public setForm() {
        this.expenseForm = new FormGroup({
            type: new FormControl(null, [Validators.required]),
            amount: new FormControl(null, [Validators.required, Validators.min(.1)]),
        });
    }

    typeChanged(): void {

        const r = 'ROSTER_DISTURBANCE_';
        const val = this.expenseForm.get('type').value;
        const amount = this.expenseForm.get('amount').value;

        if (val && val.substr(0, r.length) === r) {
            this.expenseForm.setValue(
                {
                    amount: parseInt(val.substr(r.length), 10),
                    type: val
                });
            this.expenseForm.get('amount').disable();
        } else {
            this.expenseForm.setValue(
                {
                    amount,
                    type: val
                });
            this.expenseForm.get('amount').enable();
        }
    }

    async removeExpense(id: string) {
        const successMessage = await this.translateService.get('EXPENSES.REMOVE_SUCCESS_MESSAGE').toPromise();
        await this.expenseService.delete(id)
            .then(result => {
                this.refreshData();
                this.presentToast(successMessage);
            });
    }

    async submitExpenseForm() {

        if (this.expenseForm.get('type').value && this.expenseForm.get('amount').value) {
           
            await this.expenseService.submitNewExpense(
                moment(this.date).format('YYYY-MM-DD'),
                this.expenseForm.get('type').value,
                this.expenseForm.get('amount').value
            ).then(async (result) => {
                const successMessage = await this.translateService.get('EXPENSES.SUBMIT_SUCCESS_MESSAGE').toPromise();
                this.presentToast(successMessage);
                this.amountInput.getInputElement().then(input => {
                    input.blur();
                    this.expenseForm.setValue({amount: null, type: null});
                    this.expenseForm.reset();
                });
                await this.refreshData();
            }).catch(async (err) => {
                const error: string = err.error.message;
                console.log(error);
                const expensesInFuture = await this.translateService.get('EXPENSES.EXPENSES_IN_FUTURE').toPromise();
                const unknowError = await this.translateService.get('EXPENSES.UNKNOWN_ERROR').toPromise();
                if ('You can\'t register expense in the future.' === error) {
                    this.presentToast(expensesInFuture, 'danger');
                } else {
                    this.presentToast(unknowError, 'danger');
                }
                await this.refreshData();
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.expenseService.getExpensesByDate(moment(this.date).format('YYYY-MM-DD'))
            .subscribe((result) => {
                this.expenses = result;
                this.loading = false;
            });
    }

    async presentToast(message: string, color: Color = 'primary') {
        const toast = await this.toastController.create({
            message,
            color,
            duration: 5000
        });
        toast.present();
    }

}

