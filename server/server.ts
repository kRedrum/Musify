import express from 'express';
import fs from 'fs'
import path from 'path';
import helmet from 'helmet';
import express_types from 'expre';

const Server = () => {
  const PORT = process.env.PORT;
  const HOST = process.env.HOST;
  const CONFIG_FOLDER_PATH = path.normalize(process.env.CONFIG_PATH || '/config');
  const TRUST_PROXY = process.env.TRUST_PROXY === 'true';

  const app = express();

  app.use(helmet())
  app.use((req, res, next) => {
    req.
  })

}
