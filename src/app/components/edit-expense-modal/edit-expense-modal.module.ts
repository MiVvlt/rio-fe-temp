import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditExpenseModalComponent} from './edit-expense-modal.component';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [EditExpenseModalComponent],
    exports: [EditExpenseModalComponent],
    entryComponents: [EditExpenseModalComponent],
    imports: [
        CommonModule,
        IonicModule,
        TranslateModule,
        ReactiveFormsModule
    ]
})
export class EditExpenseModalModule {
}
