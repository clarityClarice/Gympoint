import * as Yup from 'yup'

import Plan from '../models/Plan'

class PlanController{
    async store(req, res){

        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required()
        })
        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Validation fails'})
        }

        const planExists = await Plan.findOne({ where: { title: req.body.title }})

        if(planExists){
            return res.status(400).json({ error: 'Plan already exists with this title.'})
        }
        const { id, title, duration, price } = await Plan.create(req.body)
        return res.json({
            id,
            title,
            duration,
            price
        })
    }

    async update(req, res){
        const schema = Yup.object().shape({
            title: Yup.string(),
            duration: Yup.number(),
            price: Yup.number()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Validation fails'})
        }

        const { title } = req.body
        const student = await Student.findOne({ where: { title }})

        const { duration, price }= await student.update(req.body)
        return res.json({
            title,
            duration,
            price
        })
    }
}


export default new PlanController()