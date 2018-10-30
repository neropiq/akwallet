import { NotificationEntity } from '../model';
import { NOTIFICATION_COUNT} from '../actions/types';
import { state } from './index';

const INITIAL_STATE = (): NotificationEntity => ({
    notification_count:3
});

const NotificationReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case NOTIFICATION_COUNT:         
            return { ...state, notification_count: action.payload.notification_count }       
        default:
            return state;
    }
};

export default NotificationReducer;