import { IClientDTO } from './dto';
import { ContactPerson } from './ContactPerson';
import { ContactData } from './ContactData';

export class Client {
  id: string;
  name: string;
  surname: string;
  street: string;
  number: number;
  addition: string;
  city: string;
  postalCode: string;
  email: string;
  contactPersons: ContactPerson[] = [];
  contactData: ContactData[] = [];

  public static createArrayFromDTO(dtos: IClientDTO[]) {
    return dtos.map((dto) => {
      return new Client().createFromDTO(dto);
    });
  }

  constructor() {}

  public get geoUrl(): string {
    if (this.street && this.number && this.city) {
      return `geo:0,0?q=${this.street}+${this.number}+${this.city}`;
    }
    return '';
  }

  public get emailUrl(): string {
    return `mailto:${this.email}`;
  }

  public getEmailUrl(email: string): string {
    return `mailto:${email}`;
  }

  public get fullName() {
    return `${this.name} ${this.surname}`;
  }

  public createFromDTO(dto: IClientDTO) {
    if (!dto) {
      return undefined;
    }
    this.id = dto.id ? dto.id : undefined;
    this.name = dto.firstName ? dto.firstName : '';
    this.surname = dto.lastName ? dto.lastName : '';
    if ((dto as any).addresses && (dto as any).addresses[0]) {
      this.street = (dto as any).addresses[0].street
        ? (dto as any).addresses[0].street
        : '';
      this.number = (dto as any).addresses[0].number
        ? parseInt((dto as any).addresses[0].number.toString(), 10)
        : null;
      this.addition = (dto as any).addresses[0].addition
        ? (dto as any).addresses[0].addition
        : '';
      this.city = (dto as any).addresses[0].city
        ? (dto as any).addresses[0].city
        : '';
      this.postalCode = (dto as any).addresses[0].postalCode
        ? (dto as any).addresses[0].postalCode
        : '';
    }

    if ((dto as any).contactData && (dto as any).contactData.length) {
      for (const contactData of (dto as any).contactData) {
        this.contactData.push(new ContactData().createFromDTO(contactData));
      }
    }

    if ((dto as any).otherContacts && (dto as any).otherContacts.length) {
      for (const otherContact of (dto as any).otherContacts) {
        this.contactPersons.push(
          new ContactPerson().createFromDTO(otherContact)
        );
      }
    }
    return this;
  }
}
