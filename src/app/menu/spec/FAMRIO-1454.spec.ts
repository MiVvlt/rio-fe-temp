import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MenuPage} from '../menu.page';
import {StatusPopoverModule} from '../../components/status-popover/status-popover.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {MenuHeaderModule} from '../../components/menu-header/menu-header.module';
import {MenuItemModule} from '../../components/menu-item/menu-item.module';
import {FormsModule} from '@angular/forms';
import {CallNumber} from '@ionic-native/call-number/ngx';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FCM} from '@ionic-native/fcm/ngx';
import {createTestTranslateLoader} from '../../testing/variables';

let component: MenuPage;
let fixture: ComponentFixture<MenuPage>;


describe('⭐ FAMRIO-1454: Show Main Page with relevant links', () => {

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [MenuPage],
            imports: [
                StatusPopoverModule,
                IonicModule,
                RouterTestingModule,
                HttpClientModule,
                MenuHeaderModule,
                MenuItemModule,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: (createTestTranslateLoader),
                        deps: [HttpClient]
                    }
                }),
                FormsModule,
            ],
            providers: [CallNumber, FCM],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MenuPage);
        component = fixture.componentInstance;
    });

    it(`should create`, () => {
        expect(component).toBeTruthy();
    });

    it(`shows 'Mijn Agenda' link`, () => {
        expect(component.pages.findIndex((item) => {
            return item.title === 'MENU.AGENDA' && item.visible;
        })).toBeGreaterThan(-1);
    });

    it(`'Mijn Agenda' links to the correct route`, () => {
        expect(component.pages.find((item) => {
            return item.title === 'MENU.AGENDA' && item.visible;
        }).url).toBe('/menu/calendar');
    });

    it(`'Klanten Agenda' links to the correct route`, () => {
        expect(component.pages.find((item) => {
            return item.title === 'MENU.CLIENT_AGENDA';
        }).url).toBe('/menu/clients');
    });


});
