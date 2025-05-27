import { deleteApi, postApi } from "@/lib/api/axios-apis";
import { CreateFavoriteDto } from "@/server/src/exhibit/exhibit.dto";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useManageFavorites = () => {
    const queryClient = useQueryClient();

    const { mutate: add } = useMutation({
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

    const handleFavoriteChange = ({ exhibitId, userId, favId, isFavorite }: {
        exhibitId: number;
        userId: number;
        favId?: number;
        isFavorite: boolean
    }) => {
        // console.log("want to add to favorites: ", isFavorite);
        if (isFavorite && favId) {
            // console.log("deleting : favorites", isFavorite);
            deleteM(favId as number);
        }
        if (!isFavorite) {
            // console.log("adding : favorites", isFavorite);
            add({ userId, exhibitId });
        }
    };

    return { handleFavoriteChange };
}
