import { IDistanceDTO, IEmployeeDTO, IExpenseDTO } from './dto';
import * as moment from 'moment';

export class Expense {
  id: string;
  type: string;
  value: number;
  date: Date;
  dayOfWeek: number;

  public static createArrayFromDTO(dtos: IExpenseDTO[]): Expense[] {
    return dtos.map((dto) => {
      return new Expense().createFromDTO(dto);
    });
  }

  public createFromDTO(dto: IExpenseDTO): Expense {
    this.id = dto.id ? dto.id : undefined;
    this.type = dto.type ? dto.type : undefined;
    this.value = dto.costs ? dto.costs : 0;
    this.date = dto.day ? new Date(dto.day) : null;
    this.dayOfWeek = dto.day ? parseInt(moment(dto.day).format('e'), 10) : null;
    return this;
  }
}

export class Distance {
  id: string;
  date: Date;
  kmShopping: number;
  kmCar: number;
  kmCarpool: number;
  kmMotor: number;
  kmScooter: number;
  kmWalk: number;
  kmPubicTransport: number;
  kmBike: number;
  kmLeasingBike: number;

  public static createArrayFromDTO(dtos: IDistanceDTO[]): Distance[] {
    return dtos.map((dto) => {
      return new Distance().createFromDTO(dto);
    });
  }

  public get totalKm(): number {
    return (
      (this.kmCar || 0) +
      (this.kmCarpool || 0) +
      (this.kmMotor || 0) +
      (this.kmScooter || 0) +
      (this.kmWalk || 0) +
      (this.kmPubicTransport || 0) +
      (this.kmBike || 0) +
      (this.kmLeasingBike || 0)
    );
  }

  public createFromDTO(dto: IDistanceDTO): Distance {
    this.id = dto.id ? dto.id : undefined;
    this.kmShopping = dto.kmShopping ? dto.kmShopping : 0;
    this.kmCar = dto.AUTO ? dto.AUTO : 0;
    this.kmCarpool = dto.CARPOOL ? dto.CARPOOL : 0;
    this.kmMotor = dto.MOTO ? dto.MOTO : 0;
    this.kmScooter = dto.BROMFIETS ? dto.BROMFIETS : 0;
    this.kmPubicTransport = dto.OPENBAAR_VERVOER ? dto.OPENBAAR_VERVOER : 0;
    this.kmBike = dto.FIETS ? dto.FIETS : 0;
    this.kmLeasingBike = dto.LEASINGFIETS ? dto.LEASINGFIETS : 0;
    this.date = dto.day ? new Date(dto.day) : null;
    return this;
  }
}
