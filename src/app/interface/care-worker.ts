import { ICareWorkerDTO } from './dto';


export class CareWorker {
    public id: string;
    public name: string;
    public careWorkerQuintiqId: string;
    public firstName: string;
    public lastName: string;
    public middleName: string;
    public personnelId: string;
    public teamId: string;
    public teamMigrated: boolean;
    public type: string;

    public createFromDTO(dto: ICareWorkerDTO): CareWorker {
        this.id = dto.id;
        this.name = dto.name;
        this.careWorkerQuintiqId = dto.careWorkerQuintiqId;
        this.firstName = dto.firstName;
        this.lastName = dto.lastName;
        this.middleName = dto.middleName;
        this.personnelId = dto.personnelId;
        this.teamId = dto.teamId;
        this.teamMigrated = dto.teamMigrated;
        this.type = dto.type;


        return this;
    }

}
