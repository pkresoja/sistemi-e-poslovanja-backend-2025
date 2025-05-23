import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Reservation } from "../entities/Reservation";
import { UserService } from "./user.service";
import { MovieService } from "./movie.service";

const repo = AppDataSource.getRepository(Reservation)
export class ReservationService {

    static async getReservations(email: string) {
        const data = await repo.find({
            select: {
                reservationId: true,
                projectionId: true,
                projection: {
                    projectionId: true,
                    hallId: true,
                    hall: {
                        hallId: true,
                        cinemaId: true,
                        cinema: {
                            cinemaId: true,
                            name: true,
                            location: true
                        },
                        name: true
                    },
                    movieId: true,
                    time: true
                },
                numOfSeats: true,
                watchedAt: true,
                rating: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                userId: await UserService.getUserIdByEmail(email),
                deletedAt: IsNull()
            },
            relations: {
                projection: {
                    hall: {
                        cinema: true
                    }
                }
            }
        })

        const ids = Array.from(new Set(data.map(obj => obj.projection.movieId)));
        const movies = await MovieService.getMoviesByIds(ids)
        for (let obj of data) {
            obj.projection.movie = movies.data.find(m => m.movieId === obj.projection.movieId)!
        }

        return data
    }

    static async createReservation(email: string, model: Reservation) {
        await repo.save({
            projectionId: model.projectionId,
            userId: await UserService.getUserIdByEmail(email),
            numOfSeats: model.numOfSeats,
            createdAt: new Date()
        })
    }
}