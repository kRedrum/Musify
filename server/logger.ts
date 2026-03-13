import fs from 'fs';
import path from 'path';
import { Writable } from 'node:stream';
import moment from 'moment'

const default_config = {
  filename: 'app-${DATE}.log',
}

class Logger {
  private log_path: string;
  private log_level: string;
  private destination: Writable | null = null;
  private is_rotating: boolean = false;

  private state = {
    is_rotating: false
  }

  constructor(log_path?: string, log_level?: string, retention_period?: number) {
    this.log_path = path.normalize(log_path || 'config/logs');
    this.log_level = log_level || 'info';

    this.init()
  }

  async init() {
    this.folderExists();

    this.destination = new Writable()
  }

  get date() {
    return moment().format('YYYY-MM-DD');
  }

  log(level: string, msg: string) {
    
  }

  /**
   * 1. open stream if not open
   * 2. write log to stream
   * 3. flush logs if buffer is full
   */
  _open() {

  }

  /**
   * 1. clean folder based on retention period
   * 2. close stream if open
   */
  _clean() {

  }

  folderExists(): boolean {
    if (!fs.existsSync(this.log_path)) {
      try {
        fs.mkdirSync(this.log_path, { recursive: true });
      } catch (error) {
        this.log.error(`[Logger]: Error occurred while creating log directory: ${error}`);
        return false;
      }
    }
    return true;
  }

  readLogFolder() {
    return fs.readdirSync(this.log_path).filter(file => {
      const log_file = path.join(this.log_path, file);
      if (path.extname(log_file) === '.log') {
        return true;
      }
      return false;
    });
  }

  log() {

  }

  setLogLevel() {
    this.logger = this.log_level;
    this.logger.debug(`Log level set to ${this.log_level}`);
  }

}

export default new Logger();
