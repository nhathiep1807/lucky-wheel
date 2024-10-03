import { useGetListWheelItemQuery } from '@/hooks/wheel-items/useGetListWheelItem'
import React from 'react'

function ListItem() {
    const { data, isLoading, refetch } = useGetListWheelItemQuery()
    const apiData = data
        return(
            <div>ListItem</div>
        )
}

export default ListItem