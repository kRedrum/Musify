import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize,
  Association
} from 'sequelize'
import { Album } from './Album'

export class Track extends Model<InferAttributes<Track>, InferCreationAttributes<Track>> {
  declare id: CreationOptional<string>
  declare AlbumId: string
  declare isMissing: CreationOptional<boolean>
  declare path: string
  declare rel_path: CreationOptional<string | null>
  declare atime: CreationOptional<Date | null>
  declare ctime: CreationOptional<Date | null>
  declare mtime: CreationOptional<Date | null>
  declare size: CreationOptional<number | null>
  declare inode: CreationOptional<number | null>
  declare name: string | null
  declare num: number | null
  declare duration: number | null
  declare format: string | null
  declare bitrate: number | null

  declare static associations: {
    album: Association<Track, Album>
  }

  public static initialize(sequelize: Sequelize): void {
    Track.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true
        },
        AlbumId: {
          type: DataTypes.UUID,
          allowNull: false
        },
        isMissing: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          comment: 'Indicates if the track file is missing from the filesystem'
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: 'Absolute filesystem path for the track'
        },
        rel_path: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Path relative to the configured media root'
        },
        atime: {
          type: DataTypes.DATE,
          allowNull: true
        },
        ctime: {
          type: DataTypes.DATE,
          allowNull: true
        },
        mtime: {
          type: DataTypes.DATE,
          allowNull: true
        },
        size: {
          type: DataTypes.BIGINT,
          allowNull: true,
          comment: 'Size in bytes of the track file'
        },
        inode: {
          type: DataTypes.BIGINT,
          unique: true,
          allowNull: true,
          comment: 'Filesystem inode number'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        num: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment: 'Number of the track in the album'
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        format: {
          type: DataTypes.STRING,
          allowNull: true
        },
        bitrate: {
          type: DataTypes.INTEGER,
          allowNull: true
        }
      },
      {
        sequelize,
        modelName: 'Track',
        tableName: 'Tracks',
        createdAt: false,
        timestamps: false
      }
    )
  }

  public static asssociate(): void {
    Album.hasMany(Track, {
      as: 'track',
      foreignKey: 'AlbumId'
    })
  }
}
