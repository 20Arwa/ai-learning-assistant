import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const serverApi = async () => {
    const cookieStore = await cookies()

    const api = axios.create({
        baseURL: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`,
        headers: {
            Cookie: cookieStore.getAll().map(c => `${c.name}=${c.value}`).join("; "),
        },
    })


    
    

    console.log("ALL COOKIES:", cookieStore.getAll())
    
    api.interceptors.response.use(
        (response) => response,
        (error) => {
        if (error.response?.status === 401) {
            redirect("/login")
        }

        return Promise.reject(error)
        }
    )

    return api
}

export default serverApi