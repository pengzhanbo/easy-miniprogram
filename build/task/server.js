import devServer from '../dev-server';
import logger from '../utils/logger';

export const server = cb => {
    let start = new Date();
    devServer.server();
    logger.taskLog('server', Date.now() - start);
    cb();
};
