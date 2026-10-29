import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize,
} from 'sequelize'
import { Album } from './Album'

export class Artist extends Model<InferAttributes<Artist>, InferCreationAttributes<Artist>> {
  declare id: CreationOptional<string>
  declare name: string | null
  declare born: CreationOptional<string | Date | null>
  declare banner: CreationOptional<string | null>
  declare members: CreationOptional<string | null>
  declare description: CreationOptional<string | null>
  declare area: CreationOptional<string | null>
  declare type: CreationOptional<string | null>

  public static initialize(sequelize: Sequelize): void {
    Artist.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        born: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        banner: {
          type: DataTypes.STRING,
          allowNull: true
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        members: {
          type: DataTypes.STRING,
          allowNull: true
        },
        area: {
          type: DataTypes.STRING,
          allowNull: true
        },
        type: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: 'Person'
        }
      },
      {
        sequelize,
        modelName: 'Artist',
        tableName: 'Artists',
        timestamps: false
      }
    )
  }

  public static associate(): void {
    Artist.hasMany(Album)
  }
}
