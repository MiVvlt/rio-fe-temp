import { IDeviceDTO } from './dto';

export class Device {
    public token: string;

    public createFromDTO(dto: IDeviceDTO): Device {
        this.token = dto.token
        return this;
    }
    
}
