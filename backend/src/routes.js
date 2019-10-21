import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import StudentController from './app/controllers/StudentController'
import PlanController from './app/controllers/PlanController'
import EnrollmentController from './app/controllers/EnrollmentController'
import NotificationController from './app/controllers/NotificationController'
import CheckinController from './app/controllers/CheckinController'
import HelpOrderController from './app/controllers/HelpOrderController'

import authMiddleware from './app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)



//Routes for creation (post)
routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)
routes.post('/students/:id/checkins', CheckinController.store)

routes.use(authMiddleware) // Only authorizes next ones if authenticated

routes.post('/plans', PlanController.store)
routes.post('/students', StudentController.store)
routes.post('/enrollments', EnrollmentController.store)
routes.post('/students/help-orders', HelpOrderController.store)

//Routes for reading (get)
routes.get('/users', UserController.index)
routes.get('/students', StudentController.index)
routes.get('/plans', PlanController.index)
routes.get('/enrollments', EnrollmentController.index)
routes.get('/students/:id/checkins', CheckinController.index)
routes.get('/students/help-orders', HelpOrderController.index)

//Routes for updating (put)
routes.put('/students', StudentController.update)
routes.put('/users', UserController.update)
routes.put('/plans', PlanController.update)
routes.put('/notifications/:id', NotificationController.update)
routes.put('/students/help-orders', HelpOrderController.update)
routes.put('/enrollments', EnrollmentController.update)

//Routes for deleting (delete)
routes.delete('/enrollments', EnrollmentController.delete)
routes.delete('/plans', PlanController.delete)

export default routes