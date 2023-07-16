import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Model,
  Sequelize
} from 'sequelize'

export class TrackMetadata extends Model<
  InferAttributes<TrackMetadata>,
  InferCreationAttributes<TrackMetadata>
> {
  declare id: CreationOptional<string>
  declare name: string
  declare num: CreationOptional<number | null>
  declare duration: CreationOptional<number | Date | null>
  declare format: string
  declare bitrate: CreationOptional<number | null>

  public static initialize(sequelize: Sequelize): void {
    TrackMetadata.init(
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
        num: {
          type: DataTypes.NUMBER,
          comment: 'Number of the track in the album',
          allowNull: true
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        bitrate: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        format: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'TrackMetadata',
        tableName: 'TrackMetadata',
        createdAt: false,
        timestamps: false
      }
    )
  }

  public static async updateMetadata(
    existingTrackMetadata: TrackMetadata,
    newMetadata: Partial<Pick<TrackMetadata, 'name' | 'num' | 'format' | 'bitrate'>>
  ): Promise<string[]> {
    const updatedFields: string[] = []

    if (existingTrackMetadata.name !== newMetadata.name) {
      existingTrackMetadata.name = newMetadata.name ?? existingTrackMetadata.name

      updatedFields.push('name')
    }

    if (existingTrackMetadata.num !== newMetadata.num) {
      existingTrackMetadata.num = newMetadata.num ?? null
      updatedFields.push('num')
    }

    if (existingTrackMetadata.format !== newMetadata.format) {
      existingTrackMetadata.format = newMetadata.format ?? existingTrackMetadata.format

      updatedFields.push('format')
    }

    if (existingTrackMetadata.bitrate !== newMetadata.bitrate) {
      existingTrackMetadata.bitrate = newMetadata.bitrate ?? null
      updatedFields.push('bitrate')
    }

    return updatedFields
  }
}
