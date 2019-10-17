import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import StudentController from './app/controllers/StudentController'
import PlanController from './app/controllers/PlanController'
import FileController from './app/controllers/FileController'
import EnrollmentController from './app/controllers/EnrollmentController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)

//Routes get data

//Routes for creation (post)
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware) // Only authorizes next ones if authenticated

routes.post('/plans', PlanController.store)
routes.post('/students', StudentController.store)
routes.post('/files', upload.single('file'), FileController.store)
routes.post('/enrollment', EnrollmentController.store)

//Routes from reading (get)
routes.get('/users', UserController.index)


//Routes for updating (put)
routes.put('/students', StudentController.update)
routes.put('/users', UserController.update)
routes.put('/plans', PlanController.update)

export default routes