const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
const getStream = require("get-stream");
//
const cfg = require("../config.json");
//
const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".svg"];

const sendJsonResponse = (res, status, data, code = 200, error = null) => {
    res.status = status;
    res.json({
        status,
        code,
        data,
        error
    });
};

const upload_handler = (req, res) => {
    if (req.headers["x-filename"]) {
        const ext = path.extname(req.headers["x-filename"]).toLowerCase();
        // Check extension
        if (!VALID_EXTENSIONS.includes(ext)) {
            sendJsonResponse(
                res,
                "error",
                "",
                400,
                "Invalid filename extension"
            );
            return;
        }

        //
        getStream.buffer(req).then(data => {
            const hasher = crypto.createHash("md5");
            // create hash
            hasher.write(data);
            const hash = hasher.digest("hex");
            // save file
            const filename = `${hash}${ext}`;
            const file_path = `${cfg.media_path}/${filename}`;
            const url = `${cfg.media_url}/${filename}`;
            const file = fs.createWriteStream(file_path);
            file.write(data);
            sendJsonResponse(res, "success", url);
        });
    } else {
        sendJsonResponse(
            res,
            "error",
            "",
            400,
            "Header X-Filename is required!"
        );
    }
};
module.exports = {
    upload_handler
};
