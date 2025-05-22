import { deleteApi, postApi } from "@/lib/api/axios-apis";
import { CreateFavoriteDto } from "@/server/src/exhibit/exhibit.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useManageFavorites = () => {
    const queryClient = useQueryClient();

    const { mutate: add, data: newAddedFavorite } = useMutation({
        mutationKey: ['add-chat'],
        mutationFn: (dto: CreateFavoriteDto) => postApi('/exhibits/favorites/create', dto),
        onSuccess: (variables: any) => {
            const data = variables.data
            queryClient.invalidateQueries({
                queryKey: ['favorites']
            })
            return data;
        }
    });
    
    const { mutate: deleteM } = useMutation({
        mutationKey: ['add-chat'],
        mutationFn: (id: number) => deleteApi(`/exhibits/favorites/delete/${id}`),
        onSuccess: (variables: any) => {
            const data = variables.data
            queryClient.invalidateQueries({
                queryKey: ['favorites']
            })
            return data;
        }
    });


    return { addToFavorites: add, newAddedFavorite, deleteFromFavorites: deleteM };
}

export const isFavorited = (exhibitId: number, favorites: any[]) => {
    if (!favorites) return false;
    const found = favorites.find((favorite) => favorite.exhibitId === exhibitId);
    return found ? true : false;
}