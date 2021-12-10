export class TravelRequest {
    id: string;
    startTime: string;
    endTime: string;
    day: string;

    constructor(start: any, end: any, day: string) {
        this.startTime = start;
        this.endTime = end;
        this.day = day;
    }
}
