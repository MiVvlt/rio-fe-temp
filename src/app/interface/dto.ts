import {SessionEventStatus} from './SessionEvent';


export interface IChangeRequestDTO {
    id: string;
    agendaItemId: string;
    oldStartTime: string;
    oldEndTime: string;
    newStartTime: string;
    newEndTime: string;
    reasonRejection: string;
    reasonRequest: string;
    switchWorkerName: string;
}

export interface IPushNotificationDTO {
    id: string;
    timestamp: string;
    title: string;
    body: string;
    type: string;
    reference: string;
    reasonChanged: string;
}

export interface IEmployeeDTO {
    id: string;
    teamId: string;
    firstName: string;
    lastName: string;
    type?: 'CAREGIVER' | 'MEDICAL';
}

export interface IAbsenceTypeDTO {
    id: string;
    name: string;
    index: number;
}

export interface IClientDTO {
    id: string;
    firstName: string;
    lastName: string;
    street?: string;
    number?: string | number;
    city?: string;
    postalCode?: string;
    phone?: string;
    contactPerson?: IContactPersonDTO;
    contactData?: IContactDataDTO[];
}

export interface IContactPersonDTO {
    name: string;
    surname: string;
    relationship: string;
}

export interface IContactDataDTO {
    id: string;
    comment: string;
    contactType: string;
    value: string;
}

export interface IContactData {
    id: string;
    contactType: string;
    value: string;
    comment: string;
}

export interface IUpdateSessionEventDTO {
    id: string;
    start: string;
    end: string;
    distance: {
        shopping: number;
    };
}

export interface IExpenseDTO {
    id: string;
    day: string;
    costs: number;
    type: string;
}

export interface IDistanceDTO {
    id: string;
    day: string;
    AUTO: number;
    BROMFIETS: number;
    CARPOOL: number;
    MOTO: number;
    OPENBAAR_VERVOER: number;
    FIETS: number;
    LEASINGFIETS: number;
    kmShopping: number;
}

export interface IAddressDTO {
    street: string;
    number: string;
    annex: string;
    city: string;
    postalCode: string;
}

export interface ISessionEventDTO {
    id: string;
    dataset: string;
    type: 'HULPBEURT' |
        'OVERIGE_HULPBEURT' |
        'AFWEZIGHEID' |
        'OPEN_UUR' |
        'MEELOPERTAAK' |
        'NOAH_VERVOER' |
        'NOAH' |
        'REISTIJD' |
        'NOAH_KLANT';
    serviceType: string;
    sessionType: string;
    followerTasks: { role: 'COACH' | 'TRAINEE', name: string }[];
    comment: string;
    teamId: string;
    startTime: string;
    endTime?: string;
    changeRequested?: boolean;
    clientComunicated: boolean;
    pendingChange?: {
        id: string;
        newStartTime?: string;
        newEndTime?: string;
        agendaItemId?: string;
        customerNotified?: boolean;
        oldEndTime?: string;
        oldStartTime?: string;
        reasonRejection?: string;
        reasonRequest?: string;
        switchWorkerName?: string;
    };
    shoppingKm: number;
    distance: {
        shopping: number;
        transportType: string;
    };
    overlapping: boolean;
    overlappingAbsence: boolean;
    status: SessionEventStatus;
    sessionInfo?: ISessionInfoDTO;
    careWorker: IEmployeeDTO;
    isUpdated?: boolean;
    lastUpdate?: {
        start: {
            old: string;
            new: string;
        };
        end: {
            old: string;
            new: string;
        };
        reason: string;
    };
    customer: IClientDTO;
    deviatingAddress?: IAddressDTO;
    clientNotified?: boolean;
    reasonChanged?: string;
    clientCommunicated: boolean;
    noah: string;
}


export interface ISessionInfoDTO {
    requirement: string;
    careGoal: string;
    attitude: string;
    remarks: string;
    service: string;
    tasks: string[];
}

export interface ITravelTimeEventDTO {
    start: string;
    duration: string;
}

export interface IExpensesDTO {
    date: string;
    compensations: {
        id: string;
        label: string;
        value: number;
    };
    expenses: {
        description: string;
        value: number;
    }[];
    others: {
        description: string;
        value: number;
    }[];
}


export interface ICalendarDayDTO {
    distance: IDistanceDTO;
    expenses: IExpensesDTO;
    events: ISessionEventDTO[];
    travelTimeEvents: ITravelTimeEventDTO[];
}


export interface IKilometersDTO {
    id: string;
    day: string;
    BROMFIETS: number;
    AUTO: number;
    CARPOOL: number;
    MOTO: number;
    OPENBAAR_VERVOER: number;
    FIETS: number;
    LEASINGFIETS: number;
    kmShopping: number;
    transportType: string;
}

export interface IDeviceDTO {
    token: string;
}

export interface ICareWorkerDTO {
    id: string;
    name: string;
    careWorkerQuintiqId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    personnelId: string;
    teamId: string;
    teamMigrated: boolean;
    type: string;
}
