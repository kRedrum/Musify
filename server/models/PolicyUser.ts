import { DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, Sequelize } from 'sequelize'
import { User } from './User'
import { Policy } from './Policy'

export class PolicyUser extends Model<InferAttributes<PolicyUser>, InferCreationAttributes<PolicyUser>> {
  declare user_id: ForeignKey<User['id']>
  declare policy_id: ForeignKey<Policy['id']>

  public static initialize(sequelize: Sequelize): void {
    PolicyUser.init(
      {
        user_id: {
          type: DataTypes.UUID,
          references: {
            model: User,
            key: 'id'
          }
        },
        policy_id: {
          type: DataTypes.UUID,
          references: {
            model: Policy,
            key: 'id'
          }
        }
      },
      {
        sequelize,
        modelName: 'PolicyUser',
        tableName: 'Users_Policies',
        timestamps: false,
        updatedAt: false
      }
    )
  }

  public static associate(): void {
    User.belongsToMany(Policy, {
      through: PolicyUser
    })

    Policy.belongsToMany(User, {
      through: PolicyUser
    })
  }
}
