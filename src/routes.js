import { Router } from 'express'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import StudentController from './app/controllers/StudentController'
import PlanController from './app/controllers/PlanController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()

//Routes get data

//Routes for creation (post)
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware) // Only authorizes next ones if authenticated

routes.post('/plans', PlanController.store)
routes.post('/students', StudentController.store)

//Routes for updating (put)
routes.put('/students', StudentController.update)
routes.put('/users', UserController.update)
routes.put('/plans', PlanController.update)

export default routes