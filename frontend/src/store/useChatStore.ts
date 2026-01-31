import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

type user = {
    _id: string,
    userName: string;
    email: string;
    fullName: string;
    password: string;
    profilePic: string;
}

type message = {
    _id: string;
    reciverId: string;
    senderId: string;
    senderMessage?: string ;
    image?: string;
    createdAt: Date
} 

interface chatStoreState {
    users: user[],
    messages: message[]
    isTyping: boolean,
    isUsersLoading: boolean,
    isMessagesLoading:boolean,
    typingUsers: string[],
    selectedUser: user | null
    getUsers: () => void,
    getMessages: (userId: string) => void,
    sendMessage: (messageData: {text: string, image: string | null}) => void,
    subscribeToMessage: () => void,
    unsubscribeFromMessages: () => void,
    setSelectedUser: (selectedUser: user | null) => void,
    setTyping: (isTyping: boolean) => void,
    subscribeToTyping: () => void

}

export const useChatStore = create<chatStoreState>((set, get) => ({
    messages: [],
    users: [],
    isTyping: false,
    typingUsers: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser?._id}`,
                messageData
            );
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessage: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket?.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage]
            })
        })
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
    setTyping: (isTyping) => {
        const socket = useAuthStore.getState().socket;
        
        if (!socket || !get().selectedUser?._id ) return;

        if (isTyping) {
            socket?.emit('typing', get().selectedUser?._id)
        } else {            
            socket?.emit('stopped-typing', get().selectedUser?._id)
        }
        set({ isTyping })
        // get().subscribeToTyping()
    },
    subscribeToTyping: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off('display-typing');
        socket.off('hide-typing');
        
        socket.on('display-typing', (userId) => {
            set((state) => ({ 
                typingUsers: [...new Set([...state.typingUsers, userId])] 
            }));
        });
        
        socket.on('hide-typing', (userId) => {
            
            set((state) => ({ 
                typingUsers: state.typingUsers.filter(id => id !== userId) 
            }));;
        });
    }
}));