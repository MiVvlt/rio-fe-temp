import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ExpensesModalComponent} from './expenses-modal.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {ExpenseService} from '../../service/expense.service';
import {FocusInvalidInputModule} from '../focus-invalid-input/focus-invalid-input.module';

const routes: Routes = [
    {
        path: '',
        component: ExpensesModalComponent
    }
];

@NgModule({
    declarations: [ExpensesModalComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TranslateModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        FocusInvalidInputModule
    ],
    providers: [ExpenseService],
    exports: []
})
export class ExpensesModalModule {
}
