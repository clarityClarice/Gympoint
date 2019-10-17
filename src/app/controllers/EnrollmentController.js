import * as Yup from 'yup'

import Enrollment from '../models/Enrollment'

class EnrollmentController{
    async store(req,res){
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            plan_id: Yup.number().required(),
            price: Yup.number().required(),
            start_date: Yup.date().required(),
            end_date: Yup.date().required()
        })


        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Enrollment fails'})
        }

        const enrollmentExists = await Enrollment.findOne({ where: { student_id: req.body.student_id }})

        if(enrollmentExists){
            return res.status(400).json({ error: 'This student is already enrolled.'})
        }
        const { student_id, plan_id, price, start_date, end_date } = await Enrollment.create(req.body)
        return res.json({
            id,
            student_id,
            plan_id,
            price,
            start_date,
            end_date
        })
    }
}

export default new EnrollmentController