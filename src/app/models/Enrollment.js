import Sequelize, { Model } from 'sequelize'

class File extends Model{
    static init(sequelize){
        super.init(
            {
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
                price: Sequelize.FLOAT
            },
            {
                sequelize
            }
        )
        return this
    }
    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'student_id'})
        this.belongsTo(models.Plan, { foreignKey: 'plan_id'})
    }
}

export default File