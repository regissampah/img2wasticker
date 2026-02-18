import sharp from 'sharp';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Wajib false untuk upload file
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Gunakan metode POST' });
  }

  const form = formidable({});

  try {
    const [fields, files] = await form.parse(req);
    const imageFile = files.image[0]; // Mengambil file yang diupload

    if (!imageFile) {
      return res.status(400).json({ error: 'Tidak ada gambar yang diupload' });
    }

    const inputBuffer = fs.readFileSync(imageFile.filepath);

    // Proses gambar dengan Sharp
    const outputBuffer = await sharp(inputBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Membuat background transparan
      })
      .webp({ lossless: true }) // Format WebP untuk WhatsApp
      .toBuffer();

    // Set header agar browser tahu ini adalah gambar WebP
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Disposition', 'attachment; filename=sticker.webp');
    return res.send(outputBuffer);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Gagal memproses gambar: ' + error.message });
  }
}
