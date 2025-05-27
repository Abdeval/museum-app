import { getApi, postApi } from "@/lib/api/axios-apis";
import { CreateFavoriteDto } from "@/server/src/exhibit/exhibit.dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useVisit = (userId: number) => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['visits'],
        queryFn: () => getApi(`/exhibits/visits/${userId}`),
        // subscribed: isFocused
        enabled: !!userId
    });

    const { mutate } = useMutation({
        mutationKey: ['add-visit'],
        mutationFn: (dto: CreateFavoriteDto) => postApi('/exhibits/visits/create', dto),
        onSuccess: (variables: any) => {
            const data = variables.data;
            console.log('New visit ID:', data.id);
            queryClient.invalidateQueries({
                queryKey: ['visits']
            })
            return data;
        }
    });

    return { data, isLoading, isError, addVisit: mutate };
}