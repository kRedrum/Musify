import fs from 'fs'
import path from 'path';
import { Model } from 'sequelize'

class Database {
  private static instance: Database | null = null;
  private db_path: string;
  private fresh: boolean = false;

  private constructor(config_path?: string) {
    this.db_path = path.join(config_path || './db.sqlite');
  }

  initialize() {
    this._create();

  }

  _build

  _backup() {

  }

  _create() {
    if (!fs.existsSync(this.db_path)) {
      try {
        fs.writeFileSync(this.db_path, '');
        this.fresh = true;
      } catch (error) {
        console.error(`[${this.constructor.name}]: Error occurred while creating database file: ${error}`);
        return false;
      }
    }
    return true;
  }

  _close() {

  }
}
