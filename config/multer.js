const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/profiles";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-profile" + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValid = allowedTypes.test(file.mimetype);
  cb(null, isValid);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });


//----------------------------------------------------------------
//audio configration 

const audioStorage =  multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/audios";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-audio" + ext);
  },
});


const audioFilter=(req, file, cb) => {
  const allowedTypes = [".mp3", ".m4a"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .mp3 and .m4a files are allowed"));
  }
};

const uploadedAudio=multer({
  storage:audioStorage,
  fileFilter:audioFilter,
  limits: { fileSize: 50 * 1024 * 1024 } })

//---------------------------------------------------------------------------
//ccover picture configration
const coverStorage =  multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/covers";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-cover" + ext);
  },
});


const coverFilter=(req, file, cb) => {
  const allowedTypes = [".jpg", ".png"]
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("only .jpg and .png files are allowed"));
  }
};

const uploadedCover = multer({
  storage: coverStorage,
  fileFilter: coverFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});


module.exports = {upload,uploadedAudio,uploadedCover} 
 