import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Cinema } from "../entities/Cinema";

const repo = AppDataSource.getRepository(Cinema)

export class CinemaService {
    static async getCinemas() {
        return await repo.find({
            select: {
                cinemaId: true,
                name: true,
                location: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                deletedAt: IsNull()
            }
        })
    }

    static async getCinemaById(id: number) {
        const data = await repo.findOne({
            where: {
                cinemaId: id,
                deletedAt: IsNull()
            }
        })

        if (data == null)
            throw new Error('NOT_FOUND')

        return data
    }

    static async createCinema(model: Cinema) {
        await repo.save({
            name: model.name,
            location: model.location,
            createdAt: new Date()
        })
    }

    static async updateCinema(id: number, model: Cinema) {
        const cinema = await this.getCinemaById(id)
        cinema.name = model.name
        cinema.location = model.location
        cinema.updatedAt = new Date()
        await repo.save(cinema)
    }

    static async deleteCinemaById(id: number) {
        const cinema = await this.getCinemaById(id)
        cinema.deletedAt = new Date()
        await repo.save(cinema)
    }
}