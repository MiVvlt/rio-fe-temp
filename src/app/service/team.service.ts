import {Injectable} from '@angular/core';
import * as moment from 'moment';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TeamService {

    constructor(public http: HttpClient) {
    }

    public getTeamMembers(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/team-members`)
                .subscribe(() => {
                    resolve();
                }, reject);
        });
    }

    public async getAppointmentsByTeamMembers(teamMembers: number[]): Promise<any[]> {

        return new Promise((resolve, reject) => {
            this.http.get(`${environment.backendForFrontend}/agenda-item/care-worker-team/`)
                .subscribe(() => {
                    resolve();
                }, reject);
        });

        // TODO: Transform data


        /* return [{
            date: moment().startOf('week').toDate(),
            appointments: [
                {
                    careType: 'CARE',
                    careGiver: 'Anna Janssens',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(1, 'hour').toDate(),
                },
                {
                    careType: 'CARE',
                    careGiver: 'Anna Janssens',
                    clientInfo: {
                        name: 'Frans Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(1, 'hour').toDate(),
                }
            ]
        }, {
            date: moment().startOf('week').add(1, 'day').toDate(),
            appointments: [
                {
                    careType: 'CARE',
                    careGiver: 'Frans Peeters',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(1, 'days').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(1, 'days').add(1, 'hour').toDate(),
                },
                {
                    careType: 'MEDICAL',
                    careGiver: 'Anna Janssens',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(1, 'days').add(2, 'hours').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(1, 'days').add(3, 'hours').toDate(),
                }
            ]
        }, {
            date: moment().startOf('week').add(2, 'days').toDate(),
            appointments: [
                {
                    careType: 'MEDICAL',
                    careGiver: 'Anna Janssens',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(2, 'days').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(2, 'days').add(1, 'hour').toDate(),
                }
            ]
        }, {
            date: moment().startOf('week').add(3, 'days').toDate(),
            appointments: [
                {
                    careType: 'MEDICAL',
                    careGiver: 'Anna Janssens',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(3, 'days').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(3, 'days').add(1, 'hour').toDate(),
                }
            ]
        }, {
            date: moment().startOf('week').add(4, 'days').toDate(),
            appointments: [
                {
                    careType: 'CARE',
                    careGiver: 'Frans Peeters',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(4, 'days').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(4, 'days').add(1, 'hour').toDate(),
                },
                {
                    careType: 'MEDICAL',
                    careGiver: 'Anna Janssens',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(4, 'days').add(2, 'hours').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(4, 'days').add(3, 'hours').toDate(),
                }
            ]
        }, {
            date: moment().startOf('week').add(5, 'days').toDate(),
            appointments: [
                {
                    careType: 'CARE',
                    careGiver: 'Frans Peeters',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(5, 'days').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(5, 'days').add(1, 'hour').toDate(),
                }
            ]
        }, {
            date: moment().startOf('week').add(6, 'days').toDate(),
            appointments: [
                {
                    careType: 'MEDICAL',
                    careGiver: 'Anna Janssens',
                    clientInfo: {
                        name: 'Anna Janssens'
                    },
                    start: moment().set('day', moment().startOf('week').day()).add(6, 'days').toDate(),
                    end: moment().set('day', moment().startOf('week').day()).add(6, 'days').add(1, 'hour').toDate(),
                }
            ]
        }];
        */

    }
}
