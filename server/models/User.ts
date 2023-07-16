import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize
} from 'sequelize'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>
  declare name: string
  declare password: string
  declare last_login: CreationOptional<Date | null>
  declare last_activity: CreationOptional<Date | null>

  public static initialize(sequelize: Sequelize): void {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false
        },
        last_login: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true
          }
        },
        last_activity: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true
          }
        }
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'Users'
      }
    )
  }

  public static associate(): void {
    // Associations can be added here when needed.
  }
}
