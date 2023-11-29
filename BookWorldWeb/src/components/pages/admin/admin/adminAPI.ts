import axios from "axios"





export const setUserStatus = (id: string, active: boolean) => {
    return axios.patch(`api/users/status/`, {userId: id, active }) 
}

export const getUserStatus = (id: string) => {
    return axios.get<boolean>(`api/users/${id}/status`)
}


export const resetPassword = (id: string) => {
    return axios.patch(`api/users/password/reset/`, { userId: id })
}


export const changeUserData = (id: string, email: string, name: string, lastName: string) => {
    return axios.patch(`api/users/data`, { userId: id, email, name, lastName })
}