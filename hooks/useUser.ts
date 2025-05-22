import { getApi } from "@/lib/api/axios-apis"
import { useQuery } from "@tanstack/react-query"


export const useUser = (userId: number) => {
    const { data: userInfo, isLoading: isLoadingUserInfo } = useQuery({
        queryKey: ['user'],
        queryFn: () => getApi(`/users/${userId}`),
        enabled: !!userId
    });

    

    return { userInfo , isLoadingUserInfo }
}