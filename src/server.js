import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';
import router from './routers/index.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import {swaggerDocs} from './middlewares/swaggerDocs.js'


const PORT = Number(env('PORT', 14000));

export function setupServer() {
    const app = express();

    // app.use(
    //     pino({
    //       transport: {
    //         target: 'pino-pretty',
    //       },
    //     }),
    //   );

    app.use(cors());

    app.use(express.json());

    app.use(cookieParser());

    app.use(router);

    app.use('/api-docs', swaggerDocs());

    app.use('*', notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

}
