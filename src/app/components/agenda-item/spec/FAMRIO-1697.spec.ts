import {AgendaItemComponent} from '../agenda-item.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SessionEvent} from '../../../interface/SessionEvent';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {StatusPopoverModule} from '../../status-popover/status-popover.module';

let component: AgendaItemComponent;
let fixture: ComponentFixture<AgendaItemComponent>;
let clientCommunicatedBadge: HTMLElement;
let clientCommunicatedText: HTMLElement;

describe('⭐ FAMRIO-1967: Extra veld "klant verwittigd" op agenda item / planning item', () => {

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
            customer: null,
            dataset: '',
            distance: {shopping: 0},
            noah: '',
            pendingChange: {id: '', newEndTime: '', newStartTime: ''},
            serviceType: '',
            sessionType: '',
            startTime: '',
            status: null,
            teamId: '',
            type: 'HULPBEURT'
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('initializes component with default sessionEvent', () => {
        fixture.detectChanges();
        expect(component.sessionEvent).toBeDefined();
    });

    it('has a #clientCommunicatedBadge element when type equals "HULPBEURT"', () => {
        component.sessionEvent.type = 'HULPBEURT';
        fixture.detectChanges();
        clientCommunicatedBadge = fixture.nativeElement.querySelector('#clientCommunicatedBadge');
        expect(clientCommunicatedBadge).toBeTruthy();
    });

    it('doesn\'t have a #clientCommunicatedBadge element when type not equals "HULPBEURT"', () => {
        component.sessionEvent.type = 'AFWEZIGHEID';
        fixture.detectChanges();
        clientCommunicatedBadge = fixture.nativeElement.querySelector('#clientCommunicatedBadge');
        expect(clientCommunicatedBadge).toBeFalsy();
    });

    it('color property equals "danger" when clientCommunicated is false', () => {
        component.sessionEvent.clientCommunicated = false;
        component.sessionEvent.type = 'HULPBEURT';
        fixture.detectChanges();
        clientCommunicatedBadge = fixture.nativeElement.querySelector('#clientCommunicatedBadge');
        const color = clientCommunicatedBadge.getAttribute('ng-reflect-color');
        expect(color).toBe('danger');
    });

    it('color property equals "success" when clientCommunicated is true', () => {
        component.sessionEvent.clientCommunicated = true;
        component.sessionEvent.type = 'HULPBEURT';
        fixture.detectChanges();
        clientCommunicatedBadge = fixture.nativeElement.querySelector('#clientCommunicatedBadge');
        const color = clientCommunicatedBadge.getAttribute('ng-reflect-color');
        expect(color).toBe('success');
    });

    it('clientCommunicatedText content equals "GENERAL.COMMUNICATED" if clientCommunicated is true', () => {
        component.sessionEvent.clientCommunicated = true;
        component.sessionEvent.type = 'HULPBEURT';
        fixture.detectChanges();
        clientCommunicatedText = fixture.nativeElement.querySelector('#clientCommunicatedText');
        expect(clientCommunicatedText.innerText).toBe('GENERAL.COMMUNICATED');
    });

    it('clientCommunicatedText content equals "GENERAL.NOT_COMMUNICATED" if clientCommunicated is false', () => {
        component.sessionEvent.clientCommunicated = false;
        component.sessionEvent.type = 'HULPBEURT';
        fixture.detectChanges();
        clientCommunicatedText = fixture.nativeElement.querySelector('#clientCommunicatedText');
        expect(clientCommunicatedText.innerText).toBe('GENERAL.NOT_COMMUNICATED');
    });
});
