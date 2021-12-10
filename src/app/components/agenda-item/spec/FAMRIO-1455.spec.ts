import {AgendaItemComponent} from '../agenda-item.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {StatusPopoverModule} from '../../status-popover/status-popover.module';
import {TranslateModule} from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SessionEvent} from '../../../interface/SessionEvent';
import * as moment from 'moment';

let component: AgendaItemComponent;
let fixture: ComponentFixture<AgendaItemComponent>;
const STARTTIME = moment().toISOString();
const ENDTIME = moment().add(1, 'h').toISOString();


describe('⭐ FAMRIO-1455: Show MyAgenda with relevant AgendaItems', () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [AgendaItemComponent],
            imports: [
                StatusPopoverModule,
                TranslateModule.forRoot(),
                IonicModule
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AgendaItemComponent);
        component = fixture.componentInstance;
        component.sessionEvent = new SessionEvent().createFromDTO({
            id: '',
            careWorker: null,
            clientCommunicated: false,
            clientComunicated: false,
            comment: '',
            customer: {
                firstName: 'Foo',
                lastName: 'Bar',
                id: '',
            },
            dataset: '',
            distance: {shopping: 0},
            noah: '',
            pendingChange: {id: '', newEndTime: '', newStartTime: ''},
            serviceType: '',
            sessionType: 'HULPBEURT',
            startTime: STARTTIME,
            endTime: ENDTIME,
            status: null,
            teamId: '',
            type: 'HULPBEURT'
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('AgendaItems need the following info', () => {

        describe('shows Times in correct format', () => {
            it('shows start time (in "HH:MM" format)', () => {
                const startTimeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-time__from');
                expect(startTimeElement.innerText.trim()).toBe(moment(STARTTIME).format('HH:mm').trim());
            });

            it('shows end time (in "HH:MM" format)', () => {
                const endTimeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-time__to');
                expect(endTimeElement.innerText.trim()).toBe(moment(ENDTIME).format('HH:mm').trim());
            });
        });

        describe('shows Description', () => {
            it(`shows type if SessionType is OPEN_UUR`, () => {
                component.sessionEvent.type = 'OPEN_UUR';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__type');
                expect(typeElement).toBeTruthy();
            });

            it(`shows type if SessionType is AFWEZIGHEID`, () => {
                component.sessionEvent.type = 'AFWEZIGHEID';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__type');
                expect(typeElement).toBeTruthy();
            });

            it(`shows type if sessionType is REISTIJD`, () => {
                component.sessionEvent.type = 'REISTIJD';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__type');
                expect(typeElement).toBeTruthy();
            });

            it(`doesn't show type if sessionType is REISTIJD`, () => {
                component.sessionEvent.type = 'OVERIGE_HULPBEURT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__type');
                expect(typeElement).toBeFalsy();
            });

            it(`doesn't show type if sessionType is NOAH`, () => {
                component.sessionEvent.type = 'NOAH';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__type');
                expect(typeElement).toBeFalsy();
            });

            it(`doesn't show type if sessionType is NOAH_KLANT`, () => {
                component.sessionEvent.type = 'NOAH_KLANT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__type');
                expect(typeElement).toBeFalsy();
            });

            it(`doesn't show type if sessionType is NOAH_KLANT`, () => {
                component.sessionEvent.type = 'NOAH_KLANT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__type');
                expect(typeElement).toBeFalsy();
            });

            it(`shows sessionType if sessionType is OVERIGE_HULPBEURT`, () => {
                component.sessionEvent.type = 'OVERIGE_HULPBEURT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__sessionType');
                expect(typeElement).toBeTruthy();
            });

            it(`doesn't show sessionType if sessionType is NOAH`, () => {
                component.sessionEvent.type = 'NOAH';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__sessionType');
                expect(typeElement).toBeFalsy();
            });

            it(`doesn't show sessionType if sessionType is HULPBEURT`, () => {
                component.sessionEvent.type = 'HULPBEURT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__sessionType');
                expect(typeElement).toBeFalsy();
            });

            it(`shows noah if sessionType is NOAH`, () => {
                component.sessionEvent.type = 'NOAH';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__noah');
                expect(typeElement).toBeTruthy();
            });

            it(`doesn't show sessionType if sessionType is HULPBEURT`, () => {
                component.sessionEvent.type = 'HULPBEURT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__noah');
                expect(typeElement).toBeFalsy();
            });

            it(`shows client fullName if sessionType is HULPBEURT`, () => {
                component.sessionEvent.type = 'HULPBEURT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__session');
                expect(typeElement.innerText).toBe(component.sessionEvent.client.fullName);
            });

            it(`doesn't show client fullName if sessionType is NOAH`, () => {
                component.sessionEvent.type = 'NOAH';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('.event-item-title__session');
                expect(typeElement).toBeFalsy();
            });

        });

        describe('shows SessionType', () => {
            it('shows type if SessionType is "HULPBEURT"', () => {
                component.sessionEvent.type = 'HULPBEURT';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('#session-status');
                expect(typeElement).toBeTruthy();
            });

            it('shows type if SessionType is "NOAH"', () => {
                component.sessionEvent.type = 'NOAH';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('#session-status');
                expect(typeElement).toBeTruthy();
            });

            it(`doesn't show type if SessionType is "AFWEZIGHEID"`, () => {
                component.sessionEvent.type = 'AFWEZIGHEID';
                fixture.detectChanges();
                const typeElement: HTMLElement = fixture.nativeElement.querySelector('#session-status');
                expect(typeElement).toBeFalsy();
            });
        });

        describe('shows relevant icon', () => {

            it(`Shows icon if sessionType !== AFWEZIGHEID`, () => {
                component.sessionEvent.type = 'HULPBEURT';
                fixture.detectChanges();
                const iconElement: HTMLElement = fixture.nativeElement.querySelector('#session-icon');
                expect(iconElement).toBeTruthy();
            });

            it(`Hides icon if sessionType === AFWEZIGHEID`, () => {
                component.sessionEvent.type = 'AFWEZIGHEID';
                fixture.detectChanges();
                const iconElement: HTMLElement = fixture.nativeElement.querySelector('#session-icon');
                expect(iconElement).toBeFalsy();
            });

            it(`Shows lock icon if status === LOCKED`, () => {
                expect(component.getIcon('LOCKED')).toBe('lock');
            });

            it(`Shows send icon if status === VALIDATED`, () => {
                expect(component.getIcon('VALIDATED')).toBe('send');
            });

            it(`Shows checkmark icon if status === DEFINITE`, () => {
                expect(component.getIcon('DEFINITE')).toBe('checkmark');
            });

            it(`Shows swap icon if status === CHANGED`, () => {
                expect(component.getIcon('CHANGED')).toBe('swap');
            });

            it(`Shows alert icon if status === NEW`, () => {
                expect(component.getIcon('NEW')).toBe('alert');
            });

        });

    });

    describe('AgendaItems have correct colors depending on status', () => {

    });

});
