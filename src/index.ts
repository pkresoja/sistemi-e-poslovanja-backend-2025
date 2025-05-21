import express, { type Request, type Response } from 'express'
import cors from 'cors'
import { MovieRoute } from './routes/movie.route'
import morgan from 'morgan'
import { configDotenv } from 'dotenv'
import { AppDataSource } from './db'
import { CinemaRoute } from './routes/cinema.route'
import { UserRoute } from './routes/user.route'
import { UserService } from './services/user.service'
import { BookmarkRoute } from './routes/bookmark.route'
import { HallRoute } from './routes/hall.route'
import { ProjectionRoute } from './routes/projection.route'

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// Application routes
app.use(UserService.validateToken)
app.use('/api/user', UserRoute)
app.use('/api/movie', MovieRoute)
app.use('/api/cinema', CinemaRoute)
app.use('/api/bookmark', BookmarkRoute)
app.use('/api/hall', HallRoute)
app.use('/api/projection', ProjectionRoute)

// 404 Not Found
app.get('{/*path}', function (req, res) {
    res.status(404).json({
        message: 'NOT_FOUND',
        timestamp: new Date()
    })
})

configDotenv()
const port = Number(process.env.SERVER_PORT)

AppDataSource.initialize()
    .then(() => {
        console.log('Connected to database')
        app.listen(port, () => {
            console.log(`Server started on port ${port}`)
        })
    })
    .catch((e) => console.log('Database connection failed', e))