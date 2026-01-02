import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import { config } from './config';
import { AppDataSource } from './data-source';

import router from './routers';
import { logger } from './lib/logger';

import { authorization } from '@/middlewares/authorization';
import { trackingMiddleware } from './middlewares/tracking';
import { responseHelper } from './middlewares/response';
import * as worker from '@/workers';
import { initSocket } from './lib/socket';
import http from 'http';

const app = new Koa();
const server = http.createServer(app.callback());
initSocket(server);

app.use(bodyParser());
app.use(authorization);
app.use(trackingMiddleware);
app.use(responseHelper);
app.use(router.routes()).use(router.allowedMethods());

AppDataSource.initialize().then(() => {
    worker.bootstrap();
    server.listen(config.port, () => {
        logger.info({ port: config.port }, `Server started.`);
    });
});
