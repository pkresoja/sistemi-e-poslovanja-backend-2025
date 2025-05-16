import { IsNull } from "typeorm";
import { AppDataSource } from "../db";
import { Bookmark } from "../entities/Bookmark";
import { User } from "../entities/User";

const bookmarkRepo = AppDataSource.getRepository(Bookmark)
const userRepo = AppDataSource.getRepository(User)

export class BookmarkService {
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