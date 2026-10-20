import path from 'path'
import { QueryTypes, Sequelize, ModelStatic, Model } from 'sequelize'
import { logger } from './logger'
import { Album, ApiKey, Artist, Policy, PolicyUser, Track, User } from './models'

class Database {
  private readonly TAG = this.constructor.name
  private instance: Sequelize | null = null

  constructor() {}

  private async check(): Promise<void> {
    if (!this.instance) {
      throw new Error('Database has not been initialized')
    }

    try {
      await this.instance.authenticate()
      logger.info(`[${this.TAG}]: Connection has been established successfully.`)
    } catch (error) {
      logger.error(`[${this.TAG}]: Unable to connect to the database: ${error}`)

      process.exit(1)
    }
  }

  private defineModels(): void {
    if (!this.instance) {
      throw new Error('Database has not been initialized')
    }

    Policy.initialize(this.instance)
    User.initialize(this.instance)
    PolicyUser.initialize(this.instance)
    ApiKey.initialize(this.instance)
    Track.initialize(this.instance)
    Album.initialize(this.instance)
    Artist.initialize(this.instance)
  }

  private associateModels(): void {
    if (!this.instance) {
      throw new Error('Database has not been initialized')
    }

    Policy.associate()
    User.associate()
    PolicyUser.associate()
    ApiKey.associate()
    Album.associate()
    Artist.associate()
  }

  public getModel(name: string): ModelStatic<Model> | null {
    if (!this.instance?.isDefined(name)) {
      logger.error(`[${this.TAG}]: ${name} model is not defined`)
      return null
    }

    return this.instance.model(name)
  }

  public get sequelize(): Sequelize {
    if (!this.instance) {
      throw new Error('Database has not been initialized')
    }

    return this.instance
  }

  public async init(dbPath: string): Promise<void> {

    try {
      this.instance = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(dbPath, 'musify.sqlite'),
        logging: (msg) => logger.debug(msg)
      })
    } catch (error) {
      logger.error(`[${this.TAG}]: Error occurred while creating database file: ${error}`)

      process.exit(1)
    }

    await this.check()
    this.defineModels()
    this.associateModels()
    await this.sequelize.sync()
    logger.info(`[${this.TAG}]: Database models are synchronized.`)
  }
}

export default new Database()
