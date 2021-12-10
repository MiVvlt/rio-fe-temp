import {ValidateAllModalComponent, ValidateAllSessionEvent} from '../validate-all-modal.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {APP_BASE_HREF, CommonModule} from '@angular/common';
import {IonicModule, LoadingController, ModalController} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CalendarService} from '../../../service/calendar.service';

let component: ValidateAllModalComponent;
let fixture: ComponentFixture<ValidateAllModalComponent>;
let mockModalController;
let mockCalendarService;
let mockLoaderController;
describe('✅ Validate-all-modal-component: Unit tests', () => {

    mockModalController = jasmine.createSpyObj(['dismiss']);
    mockModalController.dismiss.and.returnValue();

    mockCalendarService = jasmine.createSpyObj(['getUnvalidatedCalendarEvents']);
    mockCalendarService.getUnvalidatedCalendarEvents.and.returnValue(new Promise((resolve) => resolve([])));

    mockLoaderController = jasmine.createSpyObj(['create', 'dismiss', 'present']);
    mockLoaderController.create.and.returnValue(jasmine.createSpyObj(['dismiss', 'present']));
    mockLoaderController.dismiss.and.returnValue();
    mockLoaderController.present.and.returnValue();

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
                {provide: ModalController, useValue: mockModalController},
                {provide: CalendarService, useValue: mockCalendarService},
                {provide: LoadingController, useValue: mockLoaderController},
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

    it('calls modalController.dismiss when cancel button is clicked', async () => {
        const cancelButton = fixture.nativeElement.querySelector('#cancel-button');
        cancelButton.click();
        await fixture.whenStable();
        expect(component.modal.dismiss).toHaveBeenCalled();
    });

    it('calls modalController.dismiss when submit button is clicked', async () => {
        const submitButton = fixture.nativeElement.querySelector('#submit-button');
        submitButton.click();
        await fixture.whenStable();
        expect(component.modal.dismiss).toHaveBeenCalled();
    });

    it('calls getUnvalidatedCalendarEvents on init', async () => {
        await component.getSessionEvents();
        expect(component.calendarService.getUnvalidatedCalendarEvents).toHaveBeenCalled();
    });

    it('creates loader on init', async () => {
        await component.ngOnInit();
        expect(component.loadingController.create).toHaveBeenCalled();
    });

    it('shows loader on init', async () => {
        await component.ngOnInit();
        expect(component.loader.present).toHaveBeenCalled();
    });

    it('hides loader on init', async () => {
        await component.ngOnInit();
        expect(component.loader.dismiss).toHaveBeenCalled();
    });

    describe('toValidateFilter', () => {
        it('returns true when given an item with toValidate set true', () => {
            expect(component.toValidateFilter({toValidate: true} as ValidateAllSessionEvent)).toBeTruthy();
        });

        it('returns false when given an item with toValidate set false', () => {
            expect(component.toValidateFilter({toValidate: false} as ValidateAllSessionEvent)).toBeFalsy();
        });
    });
});

describe('✅ ValidateAllSessionEvent', () => {
    it(`has a default toValidate value of true`, () => {
        expect(new ValidateAllSessionEvent().toValidate).toBeTruthy();
    });
});
