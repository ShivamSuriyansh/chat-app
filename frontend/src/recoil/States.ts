import { atom } from "recoil";

interface UserAccount {
    sender:    string;
    receiver:  string;
    content:   string;
    status:    string;
    userId:    string;
    sentAt:    string;
    username:  string;
}

const userAccountState  = atom<UserAccount>({
    key: 'userAccountState',
    default: {
        sender: '',
        receiver: '',
        content: '',
        status: '',
        userId: '',
        sentAt: '',
        username: ''
    }, 
});
export interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    sentAt: string;
}

export const friendRequestState = atom<FriendRequest | null>({
    key: 'friendRequestState',
    default: null
})

export default userAccountState;