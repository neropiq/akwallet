import { SET_LOADING } from './types';

interface Props {
    value?: boolean;
}

export const changeLoading = ({ value }: Props) => {
    return {
        type: SET_LOADING,
        payload: { value }
    }
}