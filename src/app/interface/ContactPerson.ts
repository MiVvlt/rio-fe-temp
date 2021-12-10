import {IContactPersonDTO} from './dto';
import {ContactData} from './ContactData';

import {log} from 'util';

export class ContactPerson implements IContactPersonDTO {
    public name: string;
    public surname: string;
    public relationship: string;
    public contactData: ContactData[] = [];

    public get fullName() {
        return `${this.name} ${this.surname}`;
    }

    public createFromDTO(dto: IContactPersonDTO) {

        if (!dto) {
            return undefined;
        }
        this.name = dto.name ? dto.name : '';
        this.surname = dto.surname ? dto.surname : '';
        this.relationship = (dto as any).comment ? (dto as any).comment : '';
        this.contactData = (dto as any).contactData && (dto as any).contactData.length ? (dto as any).contactData : [];
        return this;
    }

}
