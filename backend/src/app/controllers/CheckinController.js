import Checkin from '../models/Checkin'

class CheckinController{
    async store(req,res){
        const student_id = req.params.id
        const checkin = await Checkin.create({ student_id })

        return res.json(checkin)
        
    }

    async index(req, res){

        const checkins = await Checkin.find({
            student:  req.params.id
        }).sort('createdAt')

        return res.json(checkins)
    }
}

export default new CheckinController