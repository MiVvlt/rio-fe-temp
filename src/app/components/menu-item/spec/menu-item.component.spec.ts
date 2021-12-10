import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MenuItemComponent} from '../menu-item.component';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Router, RouterModule} from '@angular/router';

let component: MenuItemComponent;
let fixture: ComponentFixture<MenuItemComponent>;
let mockRouterService;

describe('✅ menu-item.component: Unit tests', () => {

    beforeEach(async () => {
        mockRouterService = jasmine.createSpyObj(['isActive']);
        mockRouterService.isActive.and.returnValue(true);

        TestBed.configureTestingModule({
            declarations: [MenuItemComponent],
            imports: [
                CommonModule,
                IonicModule,
                RouterModule.forRoot([])
            ],
            providers: [
                {provide: Router, useValue: mockRouterService},
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(MenuItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });


    it(`calls router.isActive when isActive is called`, () => {
        component.isActive();
        return expect(mockRouterService.isActive).toHaveBeenCalled();
    });

});
