import { create } from "zustand";

export const tokenStore = create((set)=>({
    isTokenValid : null,
    token: null,
    setToken: (newToken) => set({ token: newToken }), // Token 설정 함수
    setIsTokenValid : (newIsTokenValid) => set({isTokenValid: newIsTokenValid})
}));

export default tokenStore