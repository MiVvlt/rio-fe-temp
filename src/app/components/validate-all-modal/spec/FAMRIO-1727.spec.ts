import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ValidateAllModalComponent, ValidateAllSessionEvent} from '../validate-all-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {SessionEvent} from '../../../interface/SessionEvent';
import * as moment from 'moment';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
let component: ValidateAllModalComponent;
let fixture: ComponentFixture<ValidateAllModalComponent>;


describe('🐛 FAMRIO-1727: Bulk validatie bugs', () => {
    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [ValidateAllModalComponent],
            imports: [
                CommonModule,
                IonicModule,
                TranslateModule.forRoot(),
                FormsModule,
                HttpClientModule,
                RouterModule.forRoot([])
            ],
            providers: [
                {provide: APP_BASE_HREF, useValue: '/'},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(ValidateAllModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it(`shows type of absence when item has type of 'AFWEZIGHEID'`, () => {
        const e = new SessionEvent().createAbsenceForTest(
            moment().format(''),
            moment().format(''),
            'Vrije dag tijdskrediet',
        ) as ValidateAllSessionEvent;
        e.toValidate = true;
        component.unvalidatedItems = [e];
        component.ngOnInit();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('#absence-type').innerText.trim()).toBe(`(${e.comment})`);

    });

    it(`shows SESSION_TYPE.REISTIJD when type is 'REISTIJD'`, () => {
        const e = new SessionEvent().createTravelTimeForTest(
            moment().format(''),
            moment().format(''),
        ) as ValidateAllSessionEvent;
        e.toValidate = true;
        component.unvalidatedItems = [e];
        component.ngOnInit();
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('#validate-all-item__title').innerText).toBe(`SESSION_TYPE.REISTIJD`);

    });
});
