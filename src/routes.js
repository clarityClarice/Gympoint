import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import StudentController from './app/controllers/StudentController'
import PlanController from './app/controllers/PlanController'
import FileController from './app/controllers/FileController'
import EnrollmentController from './app/controllers/EnrollmentController'
import NotificationController from './app/controllers/NotificationController'

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
routes.post('/enrollments', EnrollmentController.store)

//Routes from reading (get)
routes.get('/users', UserController.index)
routes.get('/students', StudentController.index)
routes.get('/plans', PlanController.index)
routes.get('/enrollments', EnrollmentController.index)

//Routes for updating (put)
routes.put('/students', StudentController.update)
routes.put('/users', UserController.update)
routes.put('/plans', PlanController.update)
routes.put('/notifications/:id', NotificationController.update)

//Routes for deleting (delete)
routes.delete('/enrollments/:id', EnrollmentController.delete)

export default routes