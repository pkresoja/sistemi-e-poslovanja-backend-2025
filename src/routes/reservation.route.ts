import { Router } from "express";
import { defineRequest } from "../utils";
import { ReservationService } from "../services/reservation.service";

export const ReservationRoute = Router()

ReservationRoute.get('/', async (req: any, res) => {
    await defineRequest(res, async () =>
        await ReservationService.getReservations(req.user.email)
    )
})

ReservationRoute.get('/:id', async (req: any, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        return await ReservationService.getReservationById(id, req.user.email)
    })
})

ReservationRoute.post('/', async (req: any, res) => {
    await defineRequest(res, async () =>
        await ReservationService.createReservation(req.user.email, req.body)
    )
})

ReservationRoute.put('/:id', async (req: any, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await ReservationService.updateReservation(id, req.user.email, req.body)
    })
})

ReservationRoute.delete('/:id', async (req: any, res) => {
    await defineRequest(res, async () => {
        const id = Number(req.params.id)
        await ReservationService.deleteReservation(id, req.user.email)
    })
})