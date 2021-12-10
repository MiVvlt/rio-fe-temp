import {Component, Input, OnInit} from '@angular/core';
import {EXPENSE_TYPES} from '../expenses-modal/expenses-modal.component';
import {Expense} from '../../interface/Expense';
import {ModalController, ToastController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ExpenseService} from '../../service/expense.service';
import * as moment from 'moment';
import {Color} from '@ionic/core';

@Component({
    selector: 'app-edit-expense-modal',
    templateUrl: './edit-expense-modal.component.html',
    styleUrls: ['./edit-expense-modal.component.scss'],
})
export class EditExpenseModalComponent implements OnInit {
    public expenseTypes = EXPENSE_TYPES;
    @Input() public expense: Expense;

    expenseForm: FormGroup;
    loading = false;

    constructor(public toastController: ToastController,
                private translateService: TranslateService,
                private modalController: ModalController,
                private expenseService: ExpenseService) {
    }

    ngOnInit() {
        this.setForm();
    }

    public setForm() {
        this.expenseForm = new FormGroup({
            type: new FormControl(this.expense.type, [Validators.required]),
            date: new FormControl({value: this.expense.date.toISOString(), disabled: true}, [Validators.required]),
            amount: new FormControl(this.expense.value, [Validators.required, Validators.min(.1)]),
        });
    }

    typeChanged(): void {
        const r = 'ROSTER_DISTURBANCE_';
        const val = this.expenseForm.get('type').value;

        if (val.substr(0, r.length) === r) {
            this.expenseForm.patchValue(
                {
                    amount: parseInt(val.substr(r.length), 10),
                    type: val
                });
            this.expenseForm.get('amount').disable();
        } else {
            this.expenseForm.patchValue(
                {
                    amount: null,
                    type: val
                });
            this.expenseForm.get('amount').enable();
        }
    }

    public cancel() {
        this.modalController.dismiss();
    }

    public async submitExpenseForm() {
        await this.expenseService.update(
            {
                id: this.expense.id,
                day: moment(this.expenseForm.get('date').value).format('YYYY-MM-DD'),
                type: this.expenseForm.get('type').value,
                costs: this.expenseForm.get('amount').value
            }
        ).then(async (result) => {
            const successMessage = await this.translateService.get('EXPENSES.SUBMIT_SUCCESS_MESSAGE').toPromise();
            this.presentToast(successMessage);
            this.modalController.dismiss(true);
        }).catch(async (err) => {
            const error: string = err.error.message;
            const expensesInFuture = await this.translateService.get('EXPENSES.EXPENSES_IN_FUTURE').toPromise();
            const unknowError = await this.translateService.get('EXPENSES.UNKNOWN_ERROR').toPromise();
            if ('You can\'t register expense in the future.' === error) {
                this.presentToast(expensesInFuture, 'danger');
            } else {
                this.presentToast(unknowError, 'danger');
            }
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
