import { IsNull } from "typeorm"
import { AppDataSource } from "../db"
import { Hall } from "../entities/Hall"
import { dataExists } from "../utils"

const repo = AppDataSource.getRepository(Hall)

export class HallService {

    static async getHalls() {
        return await repo.find({
            select:{
                hallId: true,
                cinemaId: true,
                name: true,
                cinema: {
                    cinemaId: true,
                    name: true,
                    location: true
                }
            },
            where: {
                cinema: {
                    deletedAt: IsNull()
                },
                deletedAt: IsNull()
            },
            relations: {
                cinema: true
            }
        })
    }

    static async getHallsByCinemaId(id: number) {
        return await repo.find({
            where: {
                cinemaId: id,
                cinema: {
                    deletedAt: IsNull()
                },
                deletedAt: IsNull()
            }
        })
    }

    static async getHallById(id: number) {
        const data = await repo.findOneBy({
            hallId: id,
            cinema: {
                deletedAt: IsNull()
            },
            deletedAt: IsNull()
        })

        return dataExists(data)
    }

    static async getExpandedHallById(id: number) {
        const data = await repo.findOne({
            select: {
                hallId: true,
                cinemaId: true,
                name: true,
                cinema: {
                    cinemaId: true,
                    name: true,
                    location: true
                }
            },
            where: {
                hallId: id,
                cinema: {
                    deletedAt: IsNull()
                },
                deletedAt: IsNull()
            },
            relations: {
                cinema: true
            }
        })

        return dataExists(data)
    }

    static async createHall(model: Hall) {
        await repo.save({
            cinemaId: model.cinemaId,
            name: model.name,
            numOfSeats: model.numOfSeats,
            dolby: model.dolby,
            has3d: model.has3d,
            createdAt: new Date()
        })
    }

    static async updateHall(id: number, model: Hall) {
        const hall = await this.getHallById(id)
        hall.cinemaId = model.cinemaId
        hall.name = model.name
        hall.numOfSeats = model.numOfSeats
        hall.dolby = model.dolby
        hall.has3d = model.has3d
        hall.updatedAt = new Date()
        await repo.save(hall)
    }

    static async deleteHall(id: number) {
        const hall = await this.getHallById(id)
        hall.deletedAt = new Date()
        await repo.save(hall)
    }
}