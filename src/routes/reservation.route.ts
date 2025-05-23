import { Router } from "express";
import { defineRequest } from "../utils";
import { ReservationService } from "../services/reservation.service";

export const ReservationRoute = Router()

ReservationRoute.get('/', async (req: any, res) => {
    await defineRequest(res, async () =>
        await ReservationService.getReservations(req.user.email)
    )
})

ReservationRoute.post('/', async (req: any, res) => {
    await defineRequest(res, async () =>
        await ReservationService.createReservation(req.user.email, req.body)
    )
})