import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize
} from 'sequelize'

export class Tag extends Model<InferAttributes<Tag>, InferCreationAttributes<Tag>> {
  declare id: CreationOptional<string>
  declare name: string
  declare description: CreationOptional<string | null>

  public static initialize(sequelize: Sequelize): void {
    Tag.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Tag',
        tableName: 'Tags'
      }
    )
  }

  public static associate(): void {
    // Associations can be added here when needed.
  }
}
