import { Router } from "express";
import { defineRequest } from "../utils";
import { ProjectionService } from "../services/projection.service";

export const ProjectionRoute = Router()

ProjectionRoute.get('/movie/id/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await ProjectionService.getProjectionsByMovieId(id)
    })
})

ProjectionRoute.get('/movie/short/:short', async (req, res) => {
    await defineRequest(res, async () => {
        const short = String(req.params.short)
        return await ProjectionService.getProjectionsByMovieShortUrl(short)
    })
})

ProjectionRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await ProjectionService.getProjectionById(id)
    })
})

ProjectionRoute.post('/', async (req, res) => {
    await defineRequest(res, async () =>
        await ProjectionService.createProjection(req.body)
    )
})

ProjectionRoute.put('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await ProjectionService.updateProjection(id, req.body)
    })
})

ProjectionRoute.delete('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await ProjectionService.deleteProjection(id)
    })
})