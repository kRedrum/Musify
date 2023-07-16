import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize
} from 'sequelize'
import { User } from './User'

export class ApiKey extends Model<InferAttributes<ApiKey>, InferCreationAttributes<ApiKey>> {
  declare id: CreationOptional<string>
  declare name: string
  declare user_id: ForeignKey<User['id']>
  declare created_at: CreationOptional<Date>
  declare duration: number | null

  public static initialize(sequelize: Sequelize): void {
    ApiKey.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: User,
            key: 'id'
          }
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        duration: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'ApiKey',
        tableName: 'ApiKeys',
        updatedAt: false,
        timestamps: false
      }
    )
  }

  public static associate(): void {
    User.hasMany(ApiKey, {
      foreignKey: 'user_id'
    })

    ApiKey.belongsTo(User, {
      foreignKey: 'user_id'
    })
  }
}
