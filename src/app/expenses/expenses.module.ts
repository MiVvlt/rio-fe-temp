import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {ExpensesPage} from './expenses.page';
import {TranslateModule} from '@ngx-translate/core';
import {ExpenseService} from '../service/expense.service';
import {EditExpenseModalModule} from '../components/edit-expense-modal/edit-expense-modal.module';
import {EditExpenseModalComponent} from '../components/edit-expense-modal/edit-expense-modal.component';
import {NetworkService} from '../service/network.service';

const routes: Routes = [
    {
        path: '',
        component: ExpensesPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        EditExpenseModalModule,
        RouterModule.forChild(routes)
    ],
    declarations: [ExpensesPage],
    providers: [ExpenseService, NetworkService],
    entryComponents: [EditExpenseModalComponent],
})
export class ExpensesPageModule {
}
