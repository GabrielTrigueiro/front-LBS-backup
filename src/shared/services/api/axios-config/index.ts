import axios from "axios";
import { environment } from "../../../environment";
import { responseInterceptor } from "./interceptadores/responseInterceptor";

const api = axios.create({
    baseURL:environment.URL_BACK,
    // headers: {Authorization: `Bearer ${JSON.parse(localStorage.getItem('TOKEN') || '')}`}
})

//atribuindo os interceptadores para a istância base "api"
api.interceptors.response.use(
    (response) => responseInterceptor(response),
    (error) => responseInterceptor(error),
)

export { api }