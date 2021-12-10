import {SessionEvent} from './SessionEvent';

let instance;
describe('✅ SessionEvent: Unit tests', () => {

    beforeEach(async () => {
        instance = new SessionEvent();
    });

    it('has the correct nonValidateableStatuses', async () => {
        expect(instance.nonValidateableStatus).toEqual(['LOCKED', 'VALIDATED', 'NEW', 'REQUEST_PENDING', 'TRAVEL_REQUEST_PENDING']);
    });
});
