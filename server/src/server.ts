import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import { convertHourToMinutes } from './utils/convert-hours'
import { convertMinutesToHours } from './utils/convert-minutes'

const app = express()
app.use(cors())
app.use(express.json())
const prisma = new PrismaClient()

// localhost:3333/ads

app.get('/games', async (request, response) => {

    const games = await prisma.game.findMany({
        include: {
            _count: {
                select: { Ad: true }
            }
        }
    })

    return response.json(games)
})


app.post('/games/:id/ads', async (request, response) => {

    const gameIdParam = request.params.id
    const ad = await prisma.ad.create({
        data: {
            gameId: gameIdParam,
            name: request.body.name,
            weekDay: request.body.weekDay.join(','),
            hourStart: convertHourToMinutes ( request.body.hourStart ),
            hourEnd: convertHourToMinutes( request.body.hourEnd ),
            yearsPlaying: request.body.yearsPlaying,
            useVoice: request.body.useVoice,
            discord: request.body.discord,
        }
    })


    return response.status(201).json(ad)
})



app.get('/ads/:id/games', async (request, response) => {

    const gameIdParam = request.params.id
    const ads = await prisma.ad.findMany({
        select: {
            id: true,
            name: true,
            weekDay: true,
            hourStart: true,
            hourEnd: true,
            yearsPlaying: true,
            useVoice: true,
        },
        where: {
            gameId: gameIdParam
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return response.json(ads.map(ad => {
        return {
            ...ad,
            weekDay: ad.weekDay.split(','),
            hourStart: convertMinutesToHours(ad.hourStart),
            hourEnd: convertMinutesToHours(ad.hourEnd),
        }
    }))
})


app.get('/ads/:id/discord', async (request, response) => {
    const idParam = request.params.id
    const ad = await prisma.ad.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: idParam,
        }
    })
    return response.json({
        discord: ad.discord,
    })
})


app.listen(3333)