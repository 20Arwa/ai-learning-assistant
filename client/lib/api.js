import axios from "axios"
import toast from "react-hot-toast"
import { redirect } from "next/navigation"

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api`,
    withCredentials: true
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status

        const isAuthPage =
        typeof window !== "undefined" &&
        ["/login", "/register"].includes(window.location.pathname)

        if (status === 401 && !isAuthPage) {
            window.location.replace("/login")
        }

        return Promise.reject(error)
    }
)

export default api