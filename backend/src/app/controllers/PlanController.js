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

    async index(req, res){
        const plans = await Plan.findAll({
            attributes: ['id', 'title', 'duration', 'price']
        })
        return res.json(plans)
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
        const plan = await Plan.findOne({ where: { title }})

        const { duration, price }= await plan.update(req.body)
        return res.json({
            title,
            duration,
            price
        })
    }

    async delete(req, res){
        const plan = await Plan.destroy({ where: { id: req.body.id}})
        if(!plan){
            return res.status(404).json({ error: 'Plan not found' })
        }
        return res.json({ message: 'Deleted with success'})
    }
}


export default new PlanController()