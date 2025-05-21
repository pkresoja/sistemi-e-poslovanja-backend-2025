import { Router } from "express";
import { defineRequest } from "../utils";
import { HallService } from "../services/hall.service";
import { ProjectionService } from "../services/projection.service";

export const HallRoute = Router()

HallRoute.get('/', async (req, res) => {
    await defineRequest(res, async () =>
        await HallService.getHalls()
    )
})

HallRoute.get('/:id/projection', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await ProjectionService.getProjectionsByHallId(id)
    })
})

HallRoute.get('/:id/expanded', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await HallService.getExpandedHallById(id)
    })
})

HallRoute.get('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await HallService.getHallById(id)
    })
})

HallRoute.post('/', async (req, res) => {
    await defineRequest(res, async () =>
        await HallService.createHall(req.body)
    )
})

HallRoute.put('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await HallService.updateHall(id, req.body)
    })
})

HallRoute.delete('/:id', async (req, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await HallService.deleteHall(id)
    })
})