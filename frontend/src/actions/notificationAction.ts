import { NOTIFICATION_COUNT } from './types';

interface IProps {
    notification_count?: number
}

export const updateNotificationCount = (notificationCount: IProps) => {

    return {
        payload: { notificationCount },
        type: NOTIFICATION_COUNT,
    }
}
