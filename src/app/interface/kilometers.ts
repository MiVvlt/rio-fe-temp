import {IKilometersDTO} from './dto';

export class Kilometers {
    public id: string;
    public day: string;
    public BROMFIETS: number;
    public AUTO: number;
    public CARPOOL: number;
    public MOTO: number;
    public OPENBAAR_VERVOER: number;
    public FIETS: number;
    public LEASINGFIETS: number;
    public kmShopping: number;
    public transportType: string;

    public createFromDTO(dto: IKilometersDTO): Kilometers {
        this.id = dto.id;
        this.day = dto.day;
        this.BROMFIETS = dto.BROMFIETS;
        this.AUTO = dto.AUTO;
        this.CARPOOL = dto.CARPOOL;
        this.MOTO = dto.MOTO;
        this.OPENBAAR_VERVOER = dto.OPENBAAR_VERVOER;
        this.FIETS = dto.FIETS;
        this.LEASINGFIETS = dto.LEASINGFIETS;
        this.kmShopping = dto.kmShopping;
        this.transportType = dto.transportType;
        return this;
    }
}
