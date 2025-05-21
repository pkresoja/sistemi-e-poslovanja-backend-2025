import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Projection } from "../entities/Projection";
import { MovieService } from "./movie.service";
import { dataExists } from "../utils";

const repo = AppDataSource.getRepository(Projection)

export class ProjectionService {
    static async getProjectionsByHallId(id: number) {
        const data = await repo.find({
            select: {
                projectionId: true,
                movieId: true,
                time: true,
                createdAt: true,
                updatedAt: true
            },
            where: {
                hallId: id,
                hall: {
                    deletedAt: IsNull()
                },
                deletedAt: IsNull()
            },
            order: {
                time: 'DESC'
            }
        })

        for (let p of data) {
            const rsp = await MovieService.getMovieById(p.movieId)
            p.movie = rsp.data
        }

        return data
    }

    static async getProjectionById(id: number) {
        const data = await repo.findOneBy({
            projectionId: id,
            deletedAt: IsNull()
        })

        return dataExists(data)
    }

    static async createProjection(model: Projection) {
        await repo.save({
            hallId: model.hallId,
            movieId: model.movieId,
            time: model.time,
            createdAt: new Date()
        })
    }

    static async updateProjection(id: number, model: Projection) {
        const data = await this.getProjectionById(id)

        data.hallId = model.hallId,
        data.movieId = model.movieId
        data.time = model.time
        data.updatedAt = new Date()

        await repo.save(data)
    }

    static async deleteProjection(id: number) {
        const data = await this.getProjectionById(id)
        data.deletedAt = new Date()
        await repo.save(data)
    }
}