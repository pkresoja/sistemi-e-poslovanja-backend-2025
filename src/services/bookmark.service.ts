import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Bookmark } from "../entities/Bookmark";
import { User } from "../entities/User";
import { MovieService } from "./movie.service";

const bookmarkRepo = AppDataSource.getRepository(Bookmark)
const userRepo = AppDataSource.getRepository(User)

export class BookmarkService {
    static async getBookmarksByUserId(id: number) {
        const data = await bookmarkRepo.find({
            select: {
                bookmarkId: true,
                movieId: true,
                createdAt: true
            },
            where: {
                userId: id,
                deletedAt: IsNull()
            }
        })

        if (data.length > 0) {
            for (let bookmark of data) {
                const movie = await MovieService.getMovieById(bookmark.movieId)
                bookmark.movie = movie.data
            }
        }

        return data
    }

    static async createBookmark(email: string, movieId: number) {
        const user = await userRepo.findOne({
            select: {
                userId: true
            },
            where: {
                email: email,
                deletedAt: IsNull()
            }
        })

        if (user == null)
            throw new Error("NOT_FOUND")

        const exists = await bookmarkRepo.existsBy({
            userId: user.userId,
            movieId: movieId
        })

        if (exists)
            throw new Error('MOVIE_ALREADY_SAVED')

        await bookmarkRepo.save({
            userId: user.userId,
            movieId: movieId,
            createdAt: new Date()
        })
    }

    static async deleteBookmark(id: number) {
        const bookmark = await bookmarkRepo.findOne({
            where: {
                bookmarkId: id,
                deletedAt: IsNull()
            }
        })

        if (bookmark == null)
            throw new Error("NOT_FOUND")

        bookmark.deletedAt = new Date()
        await bookmarkRepo.save(bookmark)
    }
}