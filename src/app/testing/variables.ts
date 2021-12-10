import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export const PRIMARY_COLOR = '#3884A0';
export const SECONDARY_COLOR = 'rgb(96, 96, 96)';
export const TERTIARY_COLOR = '#16a085';
export const LOCKED_COLOR = '#7f8c8d';
export const DEFINITE_COLOR = '#2980b9';
export const VALIDATED_COLOR = '#27ae60';
export const FUTURE_COLOR = '#2980b9';
export const ABSENCE_COLOR = '#f4f5f8';


export function createTestTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
