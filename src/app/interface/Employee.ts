import {IEmployeeDTO} from './dto';

export class Employee {
    public id: string;
    public teamId: string;
    public name: string;
    public surname: string;
    public type: 'CAREGIVER' | 'MEDICAL';

    private _validTypes = ['CAREGIVER', 'MEDICAL'];

    public static createArrayFromDTO(dtos: IEmployeeDTO[]): Employee[] {
        return dtos.map((dto) => {
            return new Employee().createFromDTO(dto);
        });
    }

    public get validTypes() {
        return this._validTypes;
    }

    public get fullName() {
        return `${this.name} ${this.surname}`;
    }


    public createFromDTO(dto: IEmployeeDTO): Employee {
        if (dto) {
            this.id = dto.id ? dto.id : undefined;
            this.teamId = dto.teamId ? dto.teamId : undefined;
            this.name = dto.firstName ? dto.firstName : '';
            this.surname = dto.lastName ? dto.lastName : '';
            this.type = dto.type ? dto.type : 'CAREGIVER';
            return this;
        } else {
            return undefined;
        }
    }

    public validateType(type: string): boolean {
        return this.validTypes.indexOf(type) !== -1;
    }
}
