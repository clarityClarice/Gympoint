import * as Yup from 'yup'

import HelpOrder from '../models/HelpOrder'
import Student from '../models/Student'

import Mail from '../../lib/Mail'

class HelpOrderController{
    async store(req, res){
        const schema = Yup.object().shape({
            student_id: Yup.number().required(),
            question: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'HelpOrder fails'})
        }


        const student_id = req.body.student_id
        const isStudent = await Student.findOne({
            where: { id: student_id}
        })

        if(!isStudent){
            return res.status(401).json({ error: 'Student does not exist'})
        }


        const question = req.body.question

        const newHelpOrder = await HelpOrder.create({
            student_id,
            question,
        })

        return res.json({
            newHelpOrder
        })
    }
    async update(req, res){
        const answer2 = req.body
        console.log(answer2)
        const schema = Yup.object().shape({
            id: Yup.number().required(),
            student_id: Yup.number().required(),
            question: Yup.string(),
            answer: Yup.string().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'HelpOrder fails'})
        }
        
        const isStudent = await Student.findOne({ where: { id: req.body.student_id}})
        if(!isStudent){
            return res.status(401).json({error: 'Student not found'})
        }

        const isHelpOrder = await HelpOrder.findOne({ where: { id: req.body.id}})
        if(!isHelpOrder){
            return res.status(401).json({error: 'Help Order not found'})
        }

        const answer_at = new Date()

        const answer = req.body.answer
        await HelpOrder.update({answer, answer_at}, {where: { id: req.body.id}})
         
        

        const student = await Student.findOne({ where: {id: req.body.student_id}})
        console.log(req.body.student_id)

        console.log(student.email)
        await Mail.sendMail({
            to: `${student.name} <${student.email}>`,
            subject: 'Você recebeu uma resposta!',
            template: 'newAnswer',
            context:{
                question: req.body.question,
                answer: answer,
                answer_at: answer_at
            }
        })
        return res.json({
            student_id: req.body.student_id,
            question: req.body.question,
            answer,
            answer_at
        })

    }
    async index(req,res){
        const { student_id } = req.body
        const helpOrders = await HelpOrder.findAll({ where: { student_id }})

        return res.json(helpOrders)
    }

}

export default new HelpOrderController