import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client"
import { isAxiosError } from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;


interface authStoreState {
    authUser: {
        _id: string,
        fullName: string,
        email: string,
        profilePic: string,
        createdAt: string
    } | null,
    isSigningUp: boolean,
    isLoggingIn: boolean,
    isUpdatingProfile: boolean,
    isCheckingAuth: boolean,
    onlineUsers: string[],
    socket: Socket | null
    connectSocket: () => void,
    disconnectSocket: () => void,
    checkAuth: () => void,
    signup: (data: { userName: string, fullName: string, email: string, password: string }) => void,
    login: (data: { email: string, password: string }) => void,
    logout: () => void,
    updateProfile: (data: { profilePic: string }) => void
}

export const useAuthStore = create<authStoreState>((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("api/auth/check");

            set({ authUser: res.data });
            get().connectSocket()
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (data: { userName: string, fullName: string, email: string, password: string }) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("api/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket()
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Facing issue in Signup");
            }
        } finally {
            set({ isSigningUp: false });
        }
    },
    login: async (data: { email: string, password: string }) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("api/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket()

        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Facing issue in Login");
            }
        } finally {
            set({ isLoggingIn: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("api/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Facing issue in logout");
            }
        }
    },
    updateProfile: async (data: { profilePic: string }) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put("api/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            if (isAxiosError(error)) {
                toast.error(error.response?.data.message);
            } else {
                toast.error("Facing issue in profile update");
            }
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            },
        });
        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket?.disconnect();
        set({ socket: null });
    }
})) 