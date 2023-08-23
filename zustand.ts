
import {create} from "zustand";
import Cookies from "js-cookie"; 

interface UserState {
  users: any; 
  setUser: (userData: any) => void;
}

const useUserStore = create<UserState>((set) => ({
  users: null,
  setUser: (userData) => {
    set({ users: userData });
    localStorage.setItem("user", JSON.stringify(userData));
    Cookies.set("userToken", JSON.stringify(userData), { expires: 30 }); 
  },
}));

export default useUserStore;
