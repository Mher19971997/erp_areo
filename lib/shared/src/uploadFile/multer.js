const colors = require('colors');
colors.enable();
module.exports = (multer) => {
  return class Upload {
    constructor(storagePath) {
      this.storagePath = storagePath;
      return this.upload();
    }

    upload() {
      const self = this;
      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          if (
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/png'
          ) {
            cb(null, self.storagePath);
          } else if (file.mimetype === 'application/pdf') {
            cb(null, self.storagePath);
          } else {
            cb({ error: 'Mime type not supported' });
          }
        },
        filename(req, file, cb) {
          console.log(
            `[{file}] =>  ` + `${Date.now()}-${file.originalname}`.green
          );
          cb(null, `${Date.now()}-${file.originalname}`);
        }
      });
      return multer({ storage });
    }
  };
};
