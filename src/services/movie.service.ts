import axios from "axios";
import type { GenreModel } from "../models/genre.model";
import type { MovieModel } from "../models/movie.model";

const client = axios.create({
    baseURL: 'https://movie.pequla.com/api',
    headers: {
        'Accept': 'application/json',
        'X-Name': 'PSEP_2025'
    },
    validateStatus: (status: number) => {
        return status === 200
    }
})

export class MovieService {
    static async getMovieById(id: number) {
        return await client.get<MovieModel>(`/movie/${id}`)
    }

    static async getMoviesByGenreId(id: number) {
        return await client.request<MovieModel[]>({
            url: '/movie',
            method: 'get',
            params: {
                genre: id
            }
        })
    }

    static async getGenreById(id: number) {
        return await client.get<GenreModel>(`/genre/${id}`)
    }
}