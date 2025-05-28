import { IsNull, Not } from "typeorm";
import { AppDataSource } from "../db";
import { Reservation } from "../entities/Reservation";
import { UserService } from "./user.service";
import { MovieService } from "./movie.service";
import { dataExists } from "../utils";
import axios from "axios";
import type { User } from "../entities/User";
import { configDotenv } from "dotenv";

const repo = AppDataSource.getRepository(Reservation)
configDotenv()
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
                paidAt: true,
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

    static async getReservationById(id: number, email: string) {
        const data = await repo.findOne({
            where: {
                reservationId: id,
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

        return dataExists(data)
    }


    static async createReservation(email: string, model: Reservation) {
        await repo.save({
            projectionId: model.projectionId,
            userId: await UserService.getUserIdByEmail(email),
            numOfSeats: model.numOfSeats,
            createdAt: new Date()
        })
    }

    static async getSimpleReservationById(id: number, email: string) {
        const data = await repo.findOneBy({
            reservationId: id,
            userId: await UserService.getUserIdByEmail(email),
            deletedAt: IsNull(),
            paidAt: IsNull(),
            watchedAt: IsNull()
        })
        return dataExists(data)
    }

    static async payReservation(id: number, email: string) {
        const user: User = await UserService.getUserByEmail(email)
        const data: Reservation = await repo.findOneOrFail({
            select: {
                reservationId: true,
                numOfSeats: true,
                projectionId: true,
                projection: {
                    projectionId: true,
                    time: true,
                    movieId: true
                }
            },
            where: {
                reservationId: id,
                userId: user.userId,
                deletedAt: IsNull()
            },
            relations: {
                projection: true
            }
        })

        const movie = await MovieService.getMovieById(data.projection.movieId)
        const rsp = await axios.request({
            url: 'https://sim.purs.singidunum.ac.rs/api/invoice',
            method: 'POST',
            data: {
                indeks: process.env.PURS_TOKEN,
                token: process.env.PURS_TOKEN,
                customer: `${user.firstName} ${user.lastName}`,
                address: user.email,
                taxId: user.phone,
                items: [{
                    name: `${movie.data.title} ${new Date(data.projection.time).toLocaleString('sr-RS')}`,
                    amount: data.numOfSeats,
                    price: 3500
                }]
            }
        })

        // Save as paid
        const res = await repo.findOneByOrFail({
            reservationId: id,
            userId: user.userId,
            deletedAt: IsNull()
        })

        res.paidAt = new Date()
        res.transactionId = rsp.data.token
        repo.save(res)
    }

    static async rateReservation(id: number, email: string, body: any) {
        // Save as paid
        const res = await repo.findOneByOrFail({
            reservationId: id,
            userId: await UserService.getUserIdByEmail(email),
            paidAt: Not(IsNull()),
            deletedAt: IsNull()
        })

        res.watchedAt = new Date()
        res.rating = body.rating
        repo.save(res)
    }

    static async updateReservation(id: number, email: string, model: Reservation) {
        const reservation: Reservation = await this.getSimpleReservationById(id, email)
        reservation.projectionId = model.projectionId
        reservation.numOfSeats = model.numOfSeats
        reservation.updatedAt = new Date()
        await repo.save(reservation)
    }

    static async deleteReservation(id: number, email: string) {
        const reservation: Reservation = await this.getSimpleReservationById(id, email)
        reservation.deletedAt = new Date()
        await repo.save(reservation)
    }
}