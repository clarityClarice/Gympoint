import * as Yup from 'yup'
import { startOfHour, parseISO, isBefore } from 'date-fns'

import Enrollment from '../models/Enrollment'
import Student from '../models/Student'
import Plan from '../models/Plan'
import Notification from '../schemas/Notification'

import Mail from '../../lib/Mail'

class EnrollmentController{
    async store(req,res){
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            start_date: Yup.date().required(),
        })


        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Enrollment fails'})
        }

        const enrollmentExists = await Enrollment.findOne({ where: { student_id: req.body.student_id }})

        if(enrollmentExists){
            return res.status(400).json({ error: 'This student is already enrolled.'})
        }

        const { student_id, plan_id, start_date } = req.body
        console.log(req.body)


        const isStudent = await Student.findOne({
            where: { id: student_id}
        })
        const isPlan = await Plan.findOne({
            where: {id: plan_id}
        })

        if(!isStudent || !isPlan){
            return res.status(401).json({ error: 'Plan or Student does not exist'})
        }

        const hourStart = startOfHour(parseISO(start_date))

        if(isBefore(hourStart, new Date())){
            res.status(400).json({ error: 'Past dates are not permited'})
        }



        const plan = await Plan.findOne({ where: { id: plan_id}})
        const price = plan.price * plan.duration  //defining the enrollment's total price
        var date = new Date(start_date)
        date.setMonth(date.getMonth()+plan.duration)
        const end_date = new Date(date)

        const newEnrollment = await Enrollment.create({
            student_id,
            plan_id,
            start_date,
            end_date,
            price
        })


        /*
        * Notify student
        */
       var firstDate = new Date(start_date)
       const student = await Student.findOne({where: {id: student_id}})
       await Notification.create({
           content: `Nova matrícula de ${student.name} iniciando no dia ${firstDate.getDate()}/${firstDate.getMonth()} `,
           student: student_id
       })
       await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Matrícula confirmada!',
            template: 'newEnrollment',
            context:{
                student: student.name,
                title: plan.tirle,
                monthPrice: plan.price,
                totalPrice: price,
                date: start_date,
                endDate: end_date
            }
        })
        return res.json({
            newEnrollment
        })

        
    }

    async index(req, res){
        /*
        *If sending student_id via body, will look for a enrollment related with this student.
        *If no student_id is provided, will return all enrollments.
        */
        console.log(req.body)
        const { student_id } = req.body
        if(!student_id){
            const enrollments = await Enrollment.findAll({
                attributes: ['id', 'student_id', 'plan_id', 'start_date', 'end_date', 'price']
            })
            return res.json(enrollments)
        }
        else{
            const enrollment = await Enrollment.findOne({
                where: { student_id },
                include: [
                    {
                        model: Student,
                        as: 'student',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Plan,
                        as: 'plan',
                        attributes: ['id', 'title', 'price', 'duration']
                    }
                ]
            })
    
            return res.json(enrollment)
        }
    }

    async delete(req, res){
        
    }
}

export default new EnrollmentController