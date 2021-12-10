import { isNullOrUndefined } from 'util';
import {IContactDataDTO} from './dto';

export class ContactData implements IContactDataDTO {

    id: string;
    comment: string;
    contactType: string;
    value: string;
  
    public createFromDTO(dto: IContactDataDTO) {

        if (!dto) {
            return undefined;
        }
        this.id = dto.id ? dto.id : '';
        this.comment = dto.comment ? dto.comment : '';
        this.contactType = dto.contactType ? dto.contactType : '';
        this.value = dto.value ? dto.value : '';
        return this;
    }

    public createFromDTOArray(array: IContactDataDTO[]) {
        if (!isNullOrUndefined(array) && array.length) {
            return array.map((item)=>{
                return new ContactData().createFromDTO(item);
            });
        } else {
            return undefined;
        }
      
    }

}
