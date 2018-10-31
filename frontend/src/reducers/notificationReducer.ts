// Copyright (c) 2018 Aidos Developer

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import { ADD_NOTIFICATION, NOTIFICATION_COUNT } from '../actions/types';
import { INotificationEntity } from '../model';

const INITIAL_STATE = (): INotificationEntity => ({
    notification: [],
    notificationCount: 0,
});

const NotificationReducer = (state = INITIAL_STATE(), action: any) => {
    switch (action.type) {
        case NOTIFICATION_COUNT:
        console.log(action.payload.notificationCount)
        return { ...state, notificationCount: action.payload.notificationCount }
        case ADD_NOTIFICATION:
            const noti = state.notification;
            noti.unshift(action.payload)
            if (noti.length > 5) {
                noti.pop()
            }
            console.log(state.notificationCount)
            const cnt = state.notificationCount + 1;
            return { ...state, notification: noti, notificationCount:cnt }
        default:
            return state;
    }
};

export default NotificationReducer;