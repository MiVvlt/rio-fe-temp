import { ISessionEventDTO, ISessionInfoDTO } from './dto';
import { Employee } from './Employee';
import { Client } from './Client';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
import { isNullOrUndefined } from 'util';
import { ChangeRequest } from './ChangeRequest';

export type SessionEventStatus =
  | 'LOCKED'
  | 'NEW'
  | 'VALIDATED'
  | 'DEFINITE'
  | 'CHANGING'
  | 'DELETED'
  | 'CHANGED'
  | 'FINAL'
  | 'REQUEST_PENDING'
  | 'TRAVEL_REQUEST_PENDING'
  | 'DELETE_REQUEST_PENDING';

// OPEN, DEFINITIEF, VALIDATED
export class SessionEvent {
  public readonly validStatuses: SessionEventStatus[] = [
    'LOCKED',
    'NEW',
    'DEFINITE',
    'CHANGING',
    'CHANGED',
    'FINAL',
    'VALIDATED',
    'REQUEST_PENDING',
    'TRAVEL_REQUEST_PENDING',
    'DELETE_REQUEST_PENDING',
  ];
  public readonly nonValidateableStatus = [
    'LOCKED',
    'VALIDATED',
    'NEW',
    'REQUEST_PENDING',
    'TRAVEL_REQUEST_PENDING',
    'DELETE_REQUEST_PENDING',
  ];
  public isRemovable = false;
  public isEditable = false;
  public overlapping;
  public overlappingAbsence;
  public id: string;
  public dataset: string;
  public startTime: Date;
  public endTime: Date;
  public followerTasks: { role: 'COACH' | 'TRAINEE'; name: string }[] = [];
  private _status: SessionEventStatus;
  public street: string;
  public number: string;
  public city: string;
  public postalCode: string;
  public serviceType: string;
  public sessionType: string;
  public comment: string;
  public useDeviatingAddress: boolean;
  public client: Client;
  public userModified: boolean;
  public clientCommunicated: boolean;
  public shoppingKm: number;
  public distance: {
    shopping: number;
  };
  public showShoppingKm: boolean;

  public showDetailsButton: boolean;
  public sessionInfo: {
    requirement: string;
    careGoal: string;
    attitude: string;
    remarks: string;
    service: string;
    tasks: string[];
  };
  public type: string;

  public employee: Employee;
  public isUpdated: boolean;
  public lastUpdate: {
    start: {
      old: Date;
      new: Date;
    };
    end: {
      old: Date;
      new: Date;
    };
    reason: string;
  };

  requestedEnd?: any;
  requestedStart?: any;

  public clientNotified: boolean;
  public reasonChanged: string;
  public noah: string;
  public statusIcon: string;
  public typeIcon: string;
  public title: string;
  public resolvedServiceType: string;

  public get isNoahMeeloperTaak(): boolean {
    return (
      this.type === 'MEELOPERTAAK' &&
      this.serviceType === 'Dagcentrum-medewerker taak'
    );
  }

  pendingChange: ChangeRequest = new ChangeRequest().createFromDTO(null);

  public get start(): Date {
    return this.requestedStart
      ? moment(this.requestedStart).toDate()
      : moment(this.startTime).toDate();
  }

  public get end(): Date {
    return this.requestedEnd
      ? moment(this.requestedEnd).toDate()
      : moment(this.endTime).toDate();
  }

  public get isNoahBackup(): boolean {
    return (
      this.type === 'NOAH' &&
      this.serviceType.toLowerCase() === 'dagcentrum-back up taak'
    );
  }

  public get shortItem(): boolean {
    const diff = moment(this.end).diff(this.start, 'm');
    return diff < 30;
  }

  public get duration(): string {
    return (
      Math.floor(
        moment.duration(moment(this.end).diff(moment(this.start))).asHours()
      ) +
      ' u, ' +
      (moment.duration(moment(this.end).diff(moment(this.start))).asMinutes() %
        60) +
      ' min'
    );
  }

  public get apiStart(): string {
    return moment(this.start).format(environment.apiDateFormat);
  }

  public get apiEnd(): string {
    return moment(this.end).format(environment.apiDateFormat);
  }

  public get status(): SessionEventStatus {
    return this._status;
  }

  public set status(value: SessionEventStatus) {
    if (this.validateStatus(value)) {
      this._status = value as SessionEventStatus;
      return;
    }
    console.warn(
      `Tried to set SessionEvent.status with an invalid value:\nvalue: ${value}\nvalid options: ${this.validStatuses}`
    );
  }

  public static createArrayFromDTO(dtos: ISessionEventDTO[]): SessionEvent[] {
    return dtos.map((dto) => {
      return new SessionEvent().createFromDTO(dto);
    });
  }

  public static createSessionInfo(
    sessionInfoDTO?: ISessionInfoDTO
  ): ISessionInfoDTO {
    if (!sessionInfoDTO) {
      return undefined;
    }
    return {
      requirement: sessionInfoDTO.requirement ? sessionInfoDTO.requirement : '',
      careGoal: sessionInfoDTO.careGoal ? sessionInfoDTO.careGoal : '',
      attitude: sessionInfoDTO.attitude ? sessionInfoDTO.attitude : '',
      remarks: sessionInfoDTO.remarks ? sessionInfoDTO.remarks : '',
      tasks: sessionInfoDTO.tasks ? sessionInfoDTO.tasks : [],
      service: sessionInfoDTO.service ? sessionInfoDTO.service : '',
    };
  }

  private static createLastUpdateFromDTO(lastUpdate) {
    return {
      start: {
        old: moment(lastUpdate.start.old).toDate(),
        new: moment(lastUpdate.start.new).toDate(),
      },
      end: {
        old: moment(lastUpdate.end.old).toDate(),
        new: moment(lastUpdate.start.new).toDate(),
      },
      reason: lastUpdate.reason,
    };
  }

  private static createChangeRequestFromDTO(pendingChange) {
    return {
      requestedStart:
        pendingChange && pendingChange.newStartTime
          ? moment(pendingChange.newStartTime).toDate()
          : undefined,
      requestedEnd:
        pendingChange && pendingChange.newEndTime
          ? moment(pendingChange.newEndTime).toDate()
          : undefined,
    };
  }

  public static createIdArray(items: SessionEvent[]): string[] {
    return items.map((item) => {
      return item.id;
    });
  }

  static createFromDTO(dto: ISessionEventDTO) {
    return this.createFromDTO(dto);
  }

  public createFromDTO(dto: ISessionEventDTO): SessionEvent {
    this.id = dto.id ? dto.id : undefined;
    this.startTime = dto.startTime ? new Date(dto.startTime) : undefined;
    this.endTime = dto.endTime ? new Date(dto.endTime) : undefined;
    this.requestedStart =
      dto.pendingChange && dto.pendingChange.newStartTime
        ? dto.pendingChange.newStartTime
        : null;
    this.requestedEnd =
      dto.pendingChange && dto.pendingChange.newEndTime
        ? dto.pendingChange.newEndTime
        : null;
    this.type = dto.type ? dto.type : undefined;
    this.serviceType = dto.serviceType ? dto.serviceType : undefined;
    this.sessionType = dto.sessionType ? dto.sessionType : undefined;
    this.overlapping = Boolean(dto.overlapping);
    this.overlappingAbsence = Boolean(dto.overlappingAbsence);
    this.comment = dto.comment ? dto.comment : undefined;
    this.status = dto.status ? dto.status : 'CHANGED';
    if (this.status === 'CHANGING') {
      this.status = 'LOCKED';
    }
    if (this.status === 'FINAL') {
      this.status = 'DEFINITE';
    }
    if (this.status === 'CHANGED') {
      this.status = 'CHANGED';
    }
    if (this.status === 'DELETED') {
      this.status = 'VALIDATED';
    }
    if (this.status === undefined) {
      this.status = 'DEFINITE';
    }
    this.shoppingKm = dto.shoppingKm ? dto.shoppingKm : 0;
    this.distance = dto.distance ? dto.distance : undefined;
    this.sessionInfo = dto.customer
      ? SessionEvent.createSessionInfo((dto.customer as any).info)
      : undefined;
    this.employee = new Employee().createFromDTO(dto.careWorker);
    this.isUpdated = !!dto.isUpdated;
    this.lastUpdate = this.isUpdated
      ? SessionEvent.createLastUpdateFromDTO(dto.lastUpdate)
      : undefined;
    this.client = new Client().createFromDTO(dto.customer);

    this.street =
      dto.deviatingAddress && dto.deviatingAddress.street
        ? dto.deviatingAddress.street
        : '';
    this.number =
      dto.deviatingAddress && dto.deviatingAddress.number
        ? dto.deviatingAddress.number
        : '';
    this.city =
      dto.deviatingAddress && dto.deviatingAddress.city
        ? dto.deviatingAddress.city
        : '';
    this.postalCode =
      dto.deviatingAddress && dto.deviatingAddress.postalCode
        ? dto.deviatingAddress.postalCode
        : '';
    if (this.street.length) {
      this.useDeviatingAddress = true;
    } else {
      this.useDeviatingAddress = false;
    }

    this.followerTasks =
      dto.followerTasks && dto.followerTasks.length ? dto.followerTasks : [];
    this.useDeviatingAddress =
      !isNullOrUndefined(this.street) && this.street.length > 0;
    this.clientNotified = dto.clientNotified;
    this.clientCommunicated = !!dto.clientCommunicated;
    this.reasonChanged = dto.reasonChanged;
    this.noah = dto.noah ? dto.noah : '';
    this.showDetailsButton =
      [
        'OVERIGE_HULPBEURT',
        'NOAH',
        'AFWEZIGHEID',
        'REISTIJD',
        'OPEN_UUR',
      ].indexOf(dto.type) === -1 && !this.isNoahMeeloperTaak;
    this.showShoppingKm =
      ['REISTIJD', 'OPEN_UUR', 'AFWEZIGHEID', 'OVERIGE_HULPBEURT'].indexOf(
        dto.type
      ) === -1;
    this.isRemovable = this.getRemovable(dto);
    this.isEditable = this.getEditable(dto);
    this.statusIcon = this.getIcon(this.status);
    this.title = this.resolveTitle(dto);
    this.resolvedServiceType = this.resolveServiceType(dto.serviceType);
    this.typeIcon = this.getTypeIcon(this.resolvedServiceType);
    this.dataset = dto.dataset;
    return this;
  }

  private getRemovable(dto: ISessionEventDTO): boolean {
    return (
      dto.type === 'REISTIJD' &&
      ['DEFINITE', 'CHANGED', 'VALIDATED'].indexOf(this.status) !== -1
    );
  }

  private getEditable(dto: ISessionEventDTO) {
    return (
      ['LOCKED', 'NEW', 'REQUEST_PENDING', 'TRAVEL_REQUEST_PENDING'].indexOf(
        this.status
      ) === -1
    );
  }

  public get isFuture(): boolean {
    return moment().diff(this.end) < 0;
  }

  public validateStatus(status: string): boolean {
    return this.validStatuses.indexOf(status as SessionEventStatus) !== -1;
  }

  public get canValidate(): boolean {
    const validatableStatus =
      this.nonValidateableStatus.indexOf(this.status) === -1;
    const notInFuture = !this.isFuture;

    return validatableStatus && notInFuture;
  }

  public canCommunicate(): boolean {
    const typeCanCommunicate =
      ['HULPBEURT', 'NOAH_KLANT'].indexOf(this.type) !== -1;
    const statusCanCommunicate =
      this.nonValidateableStatus.indexOf(this.status) === -1;
    return typeCanCommunicate && statusCanCommunicate;
  }

  public requestPending(): boolean {
    return this._status === 'REQUEST_PENDING';
  }

  public get geoUrl(): string {
    return `geo:0,0?q=${this.street}+${this.number}+${this.city}`;
  }

  public createAbsenceForTest(
    start: string,
    end: string,
    comment: string
  ): SessionEvent {
    return new SessionEvent().createFromDTO({
      careWorker: undefined,
      clientCommunicated: false,
      clientComunicated: false,
      comment,
      followerTasks: null,
      overlapping: false,
      overlappingAbsence: false,
      customer: undefined,
      dataset: '',
      shoppingKm: 0,
      id: 'TEST',
      noah: '',
      pendingChange: { id: '', newEndTime: '', newStartTime: '' },
      serviceType: '',
      sessionType: '',
      startTime: start,
      endTime: end,
      status: undefined,
      teamId: 'TEST1',
      type: 'AFWEZIGHEID',
      distance: { shopping: 0, transportType: 'AUTO' },
    });
  }

  public createTravelTimeForTest(start: string, end: string): SessionEvent {
    return new SessionEvent().createFromDTO({
      careWorker: undefined,
      clientCommunicated: false,
      clientComunicated: false,
      comment: '',
      followerTasks: null,
      customer: undefined,
      overlapping: false,
      overlappingAbsence: false,
      dataset: '',
      shoppingKm: 0,
      id: 'TEST',
      noah: '',
      pendingChange: { id: '', newEndTime: '', newStartTime: '' },
      serviceType: '',
      sessionType: '',
      startTime: start,
      endTime: end,
      status: undefined,
      teamId: 'TEST1',
      type: 'REISTIJD',
      distance: { shopping: 0, transportType: 'AUTO' },
    });
  }

  public getLabel(): string {
    if (this.type === 'OVERIGE_HULPBEURT') {
      return this.sessionType + ' - ' + this.serviceType;
    }

    if (this.client) {
      if (this.client.fullName.length > 1) {
        return this.client.fullName;
      }
      if (this.client.fullName.length === 1 && this.noah.length > 1) {
        return this.noah;
      }
    }

    return '';
  }

  private getIcon(status: string): string {
    switch (status) {
      case 'LOCKED':
        return 'lock';
      case 'VALIDATED':
        return 'send';
      case 'DEFINITE':
        return 'checkmark';
      case 'CHANGED':
        return 'swap';
      case 'NEW':
        return 'alert';
      default:
        return '';
    }
  }

  private getTypeIcon(serviceType: string): string {
    switch (serviceType.toUpperCase().trim()) {
      case 'ACUTE GEZINSZORG':
        return 'medkit';

      case 'GEZINSZORG':
        return 'people';

      case 'POETSDIENST':
        return 'water';

      case 'OPPAS':
        return 'eye';

      case 'NOAH':
        return 'home';

      case 'OPVANG ZIEK KIND':
        return 'medical';

      default:
        return 'person';
    }
  }

  private resolveServiceType(serviceType: string): string {
    switch (this.extractServiceType(serviceType).toUpperCase().trim()) {
      case 'ACUTE GEZINSZORG':
        return 'Acute Gezinszorg';

      case 'GEZINSZORG':
      case 'NACHTZORG O-VL':
      case 'NIET-GESUBSIDIEERD CIRCUIT GZ':
      case 'PAB':
        return 'Gezinszorg';

      case 'POETSDIENST':
      case 'LD POETSDIENST':
      case 'NIET-GESUBSIDIEERD CIRCUIT PD':
      case 'OCMW-BEERNEM POETSDIENST':
      case 'PAB PD':
        return 'Poetsdienst';

      case 'OPPAS':
      case 'PAB OP':
      case 'LD OPPAS':
        return 'Oppas';

      case 'NOAH':
        return 'Noah';

      case 'OPVANG ZIEK KIND':
        return 'Opvang Ziek Kind';

      default:
        return ' ';
    }
  }

  private extractServiceType(serviceType: string) {
    const marker = ' (vervolg)';
    if (serviceType.indexOf(marker) !== -1) {
      const out = serviceType.substring(0, serviceType.indexOf(marker));
      return out;
    } else {
      return serviceType;
    }
  }

  private resolveTitle(dto: ISessionEventDTO) {
    if (['HULPBEURT', 'MEELOPERTAAK'].indexOf(dto.type) !== -1) {
      return this.resolveServiceType(dto.serviceType);
    } else if (['NOAH'].indexOf(dto.serviceType) !== -1) {
      return 'Dagcentrum';
    }
  }

  public getDurationInHours(e: SessionEvent): string {
    return (
      moment.duration(moment(e.endTime).diff(moment(e.startTime))).asHours() +
      'u'
    );
  }

  public getDurationAsString(): string {
    const time = moment
      .duration(moment(this.endTime).diff(moment(this.startTime)))
      .asMilliseconds();
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
    const mm = minutes < 10 ? '0' + minutes : minutes;
    return hours + 'u' + mm;
  }
}

export class SessionEventCommunicated extends SessionEvent {
  public clientCommunicated: boolean;

  public static createFromSessionEventArray(
    sessions: SessionEvent[]
  ): SessionEventCommunicated[] {
    return new Array(...sessions).map((i) => {
      const o = { ...i } as SessionEventCommunicated;
      o.clientCommunicated = true;
      return o;
    });
  }
}
