import { getApi } from "@/lib/api/axios-apis"
import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"

export const useRecommendedExhibit = () => {
    const isFocused = useIsFocused()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['recommended-exhibits'],
        queryFn: () => getApi('/exhibits/recommended'),
        subscribed: isFocused
    });

    return { data, isLoading, isError };
}

export const useExhibit = ({ search = false }) => {
    const isFocused = useIsFocused()
    const { data: exhibits, isLoading: isLoadingExhibits, isError } = useQuery({
        queryKey: ['exhibits'],
        queryFn: () => getApi('/exhibits'),
        subscribed: isFocused
    });

    const { data: exhibitsByCategories, isLoading: isLoadingExhibitsByCategories } = useQuery({
        queryKey: ['exhibits-by-categories'],
        queryFn: () => getApi('/exhibits/filters'),
        subscribed: isFocused && search,
        enabled: !!search
    });
    
    return { exhibits, exhibitsByCategories, isLoadingExhibits, isLoadingExhibitsByCategories, isError };
}

export const useFavoritedExhibit = (userId: number) => {
    const isFocused = useIsFocused()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['favorites'],
        queryFn: () => getApi(`/exhibits/favorites/get/${userId}`),
        subscribed: isFocused
    });

    return { data, isLoading, isError };
}

export const useExhibitInfo = (id: number) => {
    const isFocused = useIsFocused()
    const { data, isLoading, isError } = useQuery({
        queryKey: ['exhibit-info'],
        queryFn: () => getApi(`/exhibits/get/${id}`),
        subscribed: isFocused,
        enabled: !!id
    });

    return { data, isLoading, isError };
}