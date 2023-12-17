const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  //reject
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/png'
  )
    cb(null, true);
  else cb(new Error('Only accepting jpeg and png files'), false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

exports.addLogoImage = upload.single('logoImage');
exports.addImage = upload.single('image');

exports.resizeImage1000x1000 = async (req, res, next) => {
  try {
    if (!req.file) return next();

    req.file.filename = Date.now() + '_' + req.file.originalname;

    console.log('filename: ');
    console.log(req.file.filename);
    const slicka = sharp(req.file.buffer)
      .resize(1000, 1000, {
        fit: 'contain',
        background: {
          r: 255,
          g: 255,
          b: 255,
        },
      })
      .jpeg();

    await slicka.toFile(`backend/public/imgs/${req.file.filename}`);
    req.file.path = `backend/public/imgs/${req.file.filename}`;

    next();
  } catch (err) {
    Response.failedOperation(500, err.message, res);
  }
};
