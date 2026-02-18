const sharp = require('sharp');
const formidable = require('formidable');
const fs = require('fs');

export const config = {
  api: { bodyParser: false }, // Formidable butuh ini mati
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    try {
      const inputPath = files.image[0].filepath;
      
      // Proses gambar menggunakan Sharp
      const buffer = await sharp(inputPath)
        .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp()
        .toBuffer();

      res.setHeader('Content-Type', 'image/webp');
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: 'Gagal konversi' });
    }
  });
}
