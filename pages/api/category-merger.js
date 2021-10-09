import multer from 'multer';

const upload = multer()

export const config = {
    api: {
        bodyParser: false,
    },
}

export default function handler(req, res) {
    if (req.method === 'POST') {
        upload.array("files", 6)(req, {}, err => {
            if(err){
                res.status(400).json({ error: err })
            }
            req.files.map(file=>{
                console.log(file.originalname)
                console.log(file.buffer.toString())
            })
          })
          res.status(200).send({})
          
    }else{
        res.status(200).json({ status: 'it is running' })
    }
}

