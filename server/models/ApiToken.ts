import {
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize,
  Association,
  NonAttribute
} from 'sequelize'
import { User } from './User'

export class ApiKey extends Model<InferAttributes<ApiKey>, InferCreationAttributes<ApiKey>> {
  declare id: CreationOptional<string>
  declare name: string
  declare created_at: CreationOptional<Date>
  declare duration: number | null

  declare users?: NonAttribute<User[]>

  declare static associations: {
    users: Association<ApiKey, User>
  }

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
    ApiKey.belongsTo(User)
  }
}
