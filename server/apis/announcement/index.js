const multer = require("multer");
const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const {
  Readable
} = require('stream');

const baseRoute = "/announcement";

const iyfdDb = require('../../common/iyfd-db');

let filesCollection;
let chunksCollection;

const init = async () => {
  filesCollection = await iyfdDb.getCollection('tracks.files');
  chunksCollection = await iyfdDb.getCollection('tracks.chunks');
};

const initPromise = init();

// Borrowed from: https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
const getAnnouncement = async (req, res) => {
  res.set("content-type", "audio/mp3");
  res.set("accept-ranges", "bytes");

  const file = await filesCollection.findOne({});
  if (!file) {
    res.sendStatus(404);
    return;
  }
  const db = await iyfdDb.getDb();
  let bucket = new mongodb.GridFSBucket(db, {
    bucketName: "tracks"
  });

  let downloadStream = bucket.openDownloadStream(file._id);

  downloadStream.on("data", chunk => {
    res.write(chunk);
  });

  downloadStream.on("error", () => {
    res.sendStatus(404);
  });

  downloadStream.on("end", () => {
    res.end();
  });
};
const updateAnnouncement = async (req, res) => {
  await initPromise;
  filesCollection.deleteMany({});
  chunksCollection.deleteMany({});
  const storage = multer.memoryStorage();
  const upload = multer({
    storage: storage,
    limits: {
      fields: 1,
      fileSize: 6000000,
      files: 1,
      parts: 2
    }
  });
  upload.single("track")(req, res, async err => {
    if (err) {
      return res
        .status(400)
        .json({
          message: "Upload Request Validation Failed"
        });
    } else if (!req.body.name) {
      return res.status(400).json({
        message: "No track name in request body"
      });
    }

    let trackName = req.body.name;

    // Covert buffer to Readable Stream
    const readableTrackStream = new Readable();
    readableTrackStream.push(req.file.buffer);
    readableTrackStream.push(null);

    const db = await iyfdDb.getDb();

    let bucket = new mongodb.GridFSBucket(db, {
      bucketName: "tracks"
    });

    let uploadStream = bucket.openUploadStream(trackName);
    let id = uploadStream.id;
    readableTrackStream.pipe(uploadStream);

    uploadStream.on("error", () => {
      return res.status(500).json({
        message: "Error uploading file"
      });
    });

    uploadStream.on("finish", () => {
      return res.status(201).json({
        message: "File uploaded successfully, stored under Mongo ObjectID: " + id
      });
    });
  });
};

const routes = [{
    method: "get",
    path: "/",
    handler: getAnnouncement
  },
  {
    method: "post",
    path: "/",
    handler: updateAnnouncement,
    role: 1
  }
];

module.exports = {
  baseRoute,
  routes
};
