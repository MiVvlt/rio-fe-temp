import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IonicModule, ModalController, PickerController} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CreateTravelTimeModalComponent} from '../create-travel-time-modal.component';
import * as moment from 'moment';

let component: CreateTravelTimeModalComponent;
let fixture: ComponentFixture<CreateTravelTimeModalComponent>;
let mockModalController;
let mockPickerController;
let mockModalResult;
describe('✅ Validate-all-modal-component: Unit tests', () => {

    mockModalResult = jasmine.createSpyObj(['dismiss', 'present']);
    mockModalController = jasmine.createSpyObj(['dismiss', 'create']);
    mockModalController.dismiss.and.returnValue();
    mockModalController.create.and.returnValue(mockModalResult);

    mockPickerController = jasmine.createSpyObj(['dismiss', 'present']);
    mockPickerController.dismiss.and.returnValue();
    mockPickerController.present.and.returnValue();

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [CreateTravelTimeModalComponent],
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
                {provide: PickerController, useValue: mockPickerController},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(CreateTravelTimeModalComponent);
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
        expect(component.modalController.dismiss).toHaveBeenCalled();
    });

    it('calls modalController.create when submit button is clicked', async () => {
        const submitButton = fixture.nativeElement.querySelector('#confirm-button');
        submitButton.click();
        await fixture.whenStable();
        expect(component.modalController.create).toHaveBeenCalled();
    });

    it('calls modal.present when submit button is clicked', async () => {
        const submitButton = fixture.nativeElement.querySelector('#confirm-button');
        submitButton.click();
        await fixture.whenStable();
        expect(mockModalResult.present).toHaveBeenCalled();
    });

    it('compnent dates change when durationChanged is called', async () => {
        component.requestedEnd = undefined;
        component.requestedStart = undefined;
        component.durationChanged({start: new Date(), end: new Date()});
        await fixture.whenStable();
        expect(component.requestedStart).toBeDefined();
        expect(component.requestedEnd).toBeDefined();
    });

});

