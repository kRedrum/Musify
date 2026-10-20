import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  NonAttribute,
  Sequelize
} from 'sequelize'
import { Track } from './Track'
import { Artist } from './Artist'

export class Album extends Model<InferAttributes<Album>, InferCreationAttributes<Album>> {
  declare id: CreationOptional<string>
  declare title: CreationOptional<string>
  declare name: CreationOptional<string>
  declare cover: CreationOptional<string | null>
  declare length: CreationOptional<number>
  declare format: CreationOptional<string | null>
  declare language: CreationOptional<string | null>
  declare disctotal: CreationOptional<number | null>
  declare genre: CreationOptional<string | null>
  declare released_at: CreationOptional<string | Date | null>
  declare type: CreationOptional<string>
  declare artist?: NonAttribute<Artist>

  public static initialize(sequelize: Sequelize): void {
    Album.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Display title for the album entry'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'unknown'
        },
        cover: {
          type: DataTypes.STRING,
          allowNull: true
        },
        length: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        format: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Digital, CD, Vinyl FLAC'
        },
        language: {
          type: DataTypes.STRING,
          allowNull: true
        },
        disctotal: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        genre: {
          type: DataTypes.STRING,
          allowNull: true
        },
        released_at: {
          type: DataTypes.DATEONLY,
          allowNull: true
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: 'Album, EP',
          defaultValue: 'Album'
        }
      },
      {
        sequelize,
        modelName: 'Album',
        tableName: 'Albums',
        timestamps: false,
        indexes: [
          {
            fields: ['name', 'ArtistId'],
            unique: true
          }
        ]
      }
    )
  }

  public static associate(): void {
    Album.belongsTo(Artist, {
      as: 'artist',
      foreignKey: 'ArtistId'
    })

    Track.belongsTo(Album, {
      as: 'album',
      foreignKey: 'AlbumId'
    })


  }
}
