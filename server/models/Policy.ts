import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize
} from 'sequelize'

export class Policy extends Model<InferAttributes<Policy>, InferCreationAttributes<Policy>> {
  declare id: CreationOptional<string>
  declare name: string
  declare description: CreationOptional<string | null>

  public static initialize(sequelize: Sequelize): void {
    Policy.init(
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
        description: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Policy',
        tableName: 'Policies',
        updatedAt: false,
        createdAt: false,
        timestamps: false
      }
    )
  }

  public static associate(): void {
    // Associations can be added here when needed.
  }
}
