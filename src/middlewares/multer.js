import multer from "multer";

import { TEMP_UPLOAD_DIR } from "../constants/imageLoad.js";

const storage = multer.diskStorage({
    destination: function(req, file, cd) {
        cd(null, TEMP_UPLOAD_DIR);
    },
    filename: function (req, file, cd) {
        const uniqueSuffix = Date.now();
        cd(null, `${uniqueSuffix}_${file.originalname}`);
    },
});

export const upload = multer({storage});
