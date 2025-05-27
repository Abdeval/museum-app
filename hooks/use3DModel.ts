import { BACKEND_BASE_URL } from "@/constants"
import { getApi } from "@/lib/api/axios-apis"
import { Model3D } from "@/server/generated/prisma"
import { useQuery } from "@tanstack/react-query"
import { useCallback } from "react"


export const use3DModel = ({ exhibitId }: { exhibitId: number }) => {
    const { data: model, isLoading: isLoading3DModel, error } = useQuery({
        queryKey: ['model', exhibitId],
        queryFn: () => getApi(`/exhibits/model3d/${exhibitId}`)
    })


    const getModelUrl = useCallback((model: Model3D) => {
        return `${BACKEND_BASE_URL}/public${model.fileUrl}`
    }, [])

    console.log("3d model: ", model);
    
    return {
        model,
        isLoading3DModel,
        getModelUrl,
        error
    }
}