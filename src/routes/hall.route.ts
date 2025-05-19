import { Router } from "express";
import { defineRequest } from "../utils";
import { HallService } from "../services/hall.service";

export const HallRoute = Router()

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