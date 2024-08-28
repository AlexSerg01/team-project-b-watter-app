import { setupServer } from "./server.js";
import { innitMongoConnection } from "./bd/innitDBConnection.js";
import { createDirIfNotExists } from "./utils/createDirIfNotExists.js";
import { TEMP_UPLOAD_DIR } from "./constants/imageLoad.js";

async function bootstrap() {
    await innitMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    setupServer();
}

bootstrap();
