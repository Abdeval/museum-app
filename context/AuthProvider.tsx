import { useStorageState } from '@/hooks/useStorageState';
import { auth } from '@/lib/api/axios-instance';
import { UserCredentials, UserToken } from '@/types';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { createContext, type PropsWithChildren, use, useState } from 'react';

const AuthContext = createContext<{
    signIn: (user: Omit<UserCredentials, "confirmPassword">) => void;
    signOut: () => void;
    session?: string | null;
    isLoading: boolean;
    user: UserToken | null
}>({
    signIn: () => null,
    signOut: () => null,
    session: null,
    isLoading: false,
    user: null
})

export function useSession() {
    const value = use(AuthContext);
    if(!value) {
        throw new Error("useSession must be wrapped in a <SessionProvider />");
    }

    return value;
}

export function SessionProvider({ children }: PropsWithChildren){
    const [[isLoading, session], setSession] = useStorageState("session");
    const router = useRouter();

    const [ user, setUser ] = useState<UserToken | null>(() => {
        const userToken = SecureStore.getItem("session");
        if(userToken) {
            const user = jwtDecode(userToken) as UserToken;
            return user;
        }
        return null
    });

    const signIn = async (user: Omit<UserCredentials, "confirmPassword">) => {
        try{
            const res = await auth.post('/signin', user);
            const data = res.data.access_token;
            console.log(data);
            setSession(data);
            const userInfo = jwtDecode(data) as UserToken;
            setUser(userInfo);
        }catch(err: any){
            console.error(err);
        }
    }

    const signOut = () => {
        setSession(null);
        router.replace("/sign-in");
    }
    return (
        <AuthContext value={{
            signIn,
            signOut,
            session,
            isLoading,
            user
        }}>
            {children}
        </AuthContext>
    )
}