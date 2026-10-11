import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize,
  Association
} from 'sequelize'
import { TrackMetadata } from './TrackMetadata'
import { Album } from './Album'
import { Artist } from './Artist'

export class Track extends Model<InferAttributes<Track>, InferCreationAttributes<Track>> {
  declare id: CreationOptional<string>
  declare isMissing: CreationOptional<boolean>
  declare path: string
  declare rel_path: CreationOptional<string | null>
  declare atime: CreationOptional<Date | null>
  declare ctime: CreationOptional<Date | null>
  declare mtime: CreationOptional<Date | null>
  declare size: CreationOptional<number | null>
  declare inode: CreationOptional<number | null>

  declare static associations: {
    metadata: Association<Track, TrackMetadata>
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

  public static associate(): void {
    TrackMetadata.hasOne(Track, {
      as: 'track'
    })

    Track.belongsTo(TrackMetadata, {
      as: 'metadata'
    })
  }
}

export type NewTrackObject = InferCreationAttributes<Track> & {
  metadata: InferCreationAttributes<TrackMetadata>
  album: InferCreationAttributes<Album> & {
    artist: InferCreationAttributes<Artist>
  }
}
