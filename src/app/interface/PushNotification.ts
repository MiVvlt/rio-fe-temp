import {IAbsenceTypeDTO, IPushNotificationDTO} from './dto';

export class PushNotification {

    id: string;
    timestamp: Date;
    title: string;
    body: string;
    type: string;
    reference: string;
    reasonChanged: string;

    public static createArrayFromDTO(dtos: IPushNotificationDTO[]): PushNotification[] {
        return dtos.map((dto) => {
            return new PushNotification().createFromDTO(dto);
        });
    }

    public static createFromDTO(dto: IPushNotificationDTO): PushNotification {
        return new PushNotification().createFromDTO(dto);
    }

    public createFromDTO(dto: IPushNotificationDTO): PushNotification {
        this.id = dto.id ? dto.id : undefined;
        this.timestamp = dto.timestamp ? new Date(dto.timestamp) : undefined;
        this.title = dto.title ? dto.title : undefined;
        this.body = dto.body ? dto.body : undefined;
        this.reasonChanged = dto.reasonChanged ? dto.reasonChanged : undefined;
        this.type = dto.type ? dto.type : undefined;
        this.reference = dto.reference ? dto.reference : undefined;
        return this;
    }

}
