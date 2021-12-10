import {IChangeRequestDTO} from './dto';

export class ChangeRequest {

    id: string;
    oldStart: Date;
    oldEnd: Date;
    newStart: Date;
    newEnd: Date;
    agendaItemId: string;
    reasonRejection: string;
    reasonRequest: string;
    switchWorkerName: string;


    public static createArrayFromDTO(dtos: IChangeRequestDTO[]): ChangeRequest[] {
        return dtos.map((dto) => {
            return new ChangeRequest().createFromDTO(dto);
        });
    }

    public static createFromDTO(dto: IChangeRequestDTO): ChangeRequest {
        return new ChangeRequest().createFromDTO(dto);
    }

    public createFromDTO(dto: IChangeRequestDTO): ChangeRequest {
        // times are flipped pending a proper fix in ms-planning
        this.id = dto && dto.id ? dto.id : undefined;
        this.oldStart = dto &&  dto.newStartTime ? new Date(dto.newStartTime) : undefined;
        this.oldEnd = dto && dto.newEndTime ? new Date(dto.newEndTime) : undefined;
        this.newStart = dto && dto.newStartTime ? new Date(dto.newStartTime) : undefined;
        this.newEnd = dto && dto.newEndTime ? new Date(dto.newEndTime) : undefined;
        this.agendaItemId = dto && dto.agendaItemId ? dto.agendaItemId : '';
        this.reasonRejection = dto && dto.reasonRejection ? dto.reasonRejection : '';
        this.reasonRequest = dto && dto.reasonRequest ? dto.reasonRequest : '';
        this.switchWorkerName = dto && dto.switchWorkerName ? dto.switchWorkerName : '';
        return this;
    }

}
