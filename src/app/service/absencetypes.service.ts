import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {IAbsenceTypeDTO} from '../interface/dto';
import {AbsenceType} from '../interface/AbsenceType';


@Injectable({
    providedIn: 'root'
})
export class AbsenceTypesService {

    constructor(private http: HttpClient) {
    }



    public async getAbsenceTypesAsync(dataset: string): Promise<AbsenceType[]> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/absence/type/${dataset}`, {headers: {Auth: 'True'}})
                .subscribe((result: IAbsenceTypeDTO[]) => {
                    resolve(AbsenceType.createArrayFromDTO(result));
                }, reject);
        });
    }


    public async changeAbsenceType(absenceType: any, id: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.put(`${environment.backendForFrontend}/absence`, {
                absenceType: absenceType.id,
                agendaItemId: id
            }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    getAbsenceTypeByDatasetAndId(dataset: string, sessionType: string): Promise<AbsenceType> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/absence/dataset/${dataset}/id/${sessionType}`, {headers: {Auth: 'True'}})
                .subscribe((result: IAbsenceTypeDTO) => {
                    resolve(AbsenceType.createFromDTO(result));
                }, reject);
        });
    }
}
