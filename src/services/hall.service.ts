import { IsNull } from "typeorm"
import { AppDataSource } from "../db"
import { Hall } from "../entities/Hall"

const repo = AppDataSource.getRepository(Hall)

export class HallService {
    static async getHallsByCinemaId(id: number) {
        return await repo.find({
            where: {
                cinemaId: id,
                deletedAt: IsNull()
            }
        })
    }

    static async getHallById(id: number) {
        const data = await repo.findOneBy({
            hallId: id,
            deletedAt: IsNull()
        })

        if (data == null)
            throw new Error('NOT_FOUND')

        return data
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