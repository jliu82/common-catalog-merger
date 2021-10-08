export default function handler(req, res) {
    if (req.method === 'POST') {
        res.status(200).json({ file: 'output-file-path' })
    }else{
        res.status(200).json({ status: 'it is running' })
    }
}

