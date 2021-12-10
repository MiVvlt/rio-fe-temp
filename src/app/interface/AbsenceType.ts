import {IAbsenceTypeDTO} from './dto';

export class AbsenceType {

    id: string;
    name: string;
    index: number;

    public static createArrayFromDTO(dtos: IAbsenceTypeDTO[]): AbsenceType[] {
        return dtos.map((dto) => {
            return new AbsenceType().createFromDTO(dto);
        });
    }

    public static createFromDTO(dto: IAbsenceTypeDTO): AbsenceType {
        return new AbsenceType().createFromDTO(dto);
    }

    public createFromDTO(dto: IAbsenceTypeDTO): AbsenceType {
        this.id = dto.id ? dto.id : undefined;
        this.name = dto.name ? dto.name : undefined;
        this.index = dto.index ? dto.index : 0;
        return this;
    }

}
