import { NOTIFICATION_COUNT} from './types';

interface Props {
    notification_count?:number
}

export const updateNotificationCount = ( notification_count : Props) => {
    
    return {
        type:NOTIFICATION_COUNT,
        payload:{ notification_count }
    }
}
