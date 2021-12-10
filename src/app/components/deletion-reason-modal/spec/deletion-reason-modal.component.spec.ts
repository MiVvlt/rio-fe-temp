import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IonicModule, ModalController} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {DeletionReasonModalComponent} from '../deletion-reason-modal.component';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

let component: DeletionReasonModalComponent;
let fixture: ComponentFixture<DeletionReasonModalComponent>;
let mockModalController;

describe('✅ deletion-reason-modal.component: Unit tests', () => {

    beforeEach(async () => {
        mockModalController = jasmine.createSpyObj(['dismiss']);
        mockModalController.dismiss.and.returnValue();

        TestBed.configureTestingModule({
            declarations: [DeletionReasonModalComponent],
            imports: [
                CommonModule,
                IonicModule,
                FormsModule,
                TranslateModule.forRoot()
            ],
            providers: [
                {provide: ModalController, useValue: mockModalController},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(DeletionReasonModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });


    it(`calls submit method when submit button is clicked`, async () => {
        const submitButton = fixture.nativeElement.querySelector('#confirm-button');
        const submitSpy = spyOn(component, 'submit');
        submitButton.click();
        await fixture.whenStable();
        expect(submitSpy).toHaveBeenCalled();
    });

    it('calls modalController.dismiss when submit button is clicked', async () => {
        const submitButton = fixture.nativeElement.querySelector('#confirm-button');
        submitButton.click();
        await fixture.whenStable();
        expect(component.modalController.dismiss).toHaveBeenCalled();
    });

    it(`calls cancel method when cancel button is clicked`, async () => {
        const cancelButton = fixture.nativeElement.querySelector('#cancel-button');
        const cancelSpy = spyOn(component, 'dismiss');
        cancelButton.click();
        await fixture.whenStable();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('calls modalController.dismiss when cancel button is clicked', async () => {
        const cancelButton = fixture.nativeElement.querySelector('#cancel-button');
        cancelButton.click();
        await fixture.whenStable();
        expect(component.modalController.dismiss).toHaveBeenCalled();
    });


});
