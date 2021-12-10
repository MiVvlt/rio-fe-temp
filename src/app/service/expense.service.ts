import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {IDistanceDTO, IExpenseDTO} from '../interface/dto';
import {HttpClient} from '@angular/common/http';
import {Distance, Expense} from '../interface/Expense';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    constructor(private http: HttpClient) {
    }

    getExpensesByDate(date: string): Observable<Expense[]> {
        return this.http.get(`${environment.backendForFrontend}/expense/date/${date}`, {headers: {Auth: 'True'}})
            .pipe(map((dto: IExpenseDTO[]) => {
                return Expense.createArrayFromDTO(dto);
            }));
    }

    getExpensesByDates(fromDate: string, toDate: string): Promise<Expense[]> {
        return this.http.get(`${environment.backendForFrontend}/expense/date/from/${fromDate}/to/${toDate}`, {headers: {Auth: 'True'}})
            .pipe(map((dto: IExpenseDTO[]) => {
                return Expense.createArrayFromDTO(dto);
            })).toPromise();
    }

    public async submitNewExpense(date: string, type: string, value: number): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.post(`${environment.backendForFrontend}/expense`, {
                day: date,
                costs: value,
                type
            }, {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async delete(id: string) {
        return new Promise((resolve, reject) => {
            this.http.delete(`${environment.backendForFrontend}/expense/${id}`,
                {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async update(item: IExpenseDTO) {
        return new Promise((resolve, reject) => {
            this.http.put(`${environment.backendForFrontend}/expense/${item.id}`, item,
                {headers: {Auth: 'True'}})
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public getDistancesByDates(fromDate: string, toDate: string): Promise<Distance[]> {
        return this.http.get(`${environment.backendForFrontend}/kilometers/date/from/${fromDate}/to/${toDate}`, {headers: {Auth: 'True'}})
            .pipe(map((dto: IDistanceDTO[]) => {
                return Distance.createArrayFromDTO(dto);
            })).toPromise();
    }

}
