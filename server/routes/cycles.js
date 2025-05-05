const express = require('express')
const jwt = require('jsonwebtoken')
const Cycle = require('../models/Cycle')
const router = express.Router()

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'Token yok' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Geçersiz token' })
    req.user = user
    next()
  })
}

// GET
router.get('/', authMiddleware, async (req, res) => {
  try {
    const cycles = await Cycle.find({ userId: req.user.id }).sort({ start: -1 }) // en yenisi önce

    if (!cycles || cycles.length === 0) {
      return res.status(200).json([])  // boş liste döndür
    }

    res.json(cycles)

  } catch (err) {
    console.error('Dönem verisi alınamadı:', err)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

router.post('/', authMiddleware, async (req, res) => {
  // request body'den gelen verileri alıyoruz
  const { start, durationDays, explanation } = req.body;

  // Başlangıç tarihi ve süre (gün) zorunlu
  if (!start || !durationDays) {
    return res.status(400).json({ message: 'Başlangıç ve süre (gün) zorunludur' });
  }

  try {
    // Yeni dönemi oluşturuyoruz
    const newCycle = new Cycle({
      userId: req.user.id,
      start: new Date(start),
      durationDays,
      explanation: explanation || ''  // Eğer açıklama yoksa boş string ile başlat
    });

    // Model doğrulaması (isteğe bağlı)
    const validationError = newCycle.validateSync();
    if (validationError) {
      return res.status(400).json({ message: 'Veri geçersiz', error: validationError });
    }

    // Yeni dönemi kaydediyoruz
    await newCycle.save();

    // Başarılı bir kaydetme işlemi sonrası yanıt
    res.status(201).json({ message: 'Dönem kaydedildi', cycle: newCycle });
  } catch (err) {
    // Hata durumunda detaylı mesaj
    console.error('Dönem ekleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Cycle.findOneAndDelete({ _id: req.params.id, userId: req.user.id })

    if (!deleted) {
      return res.status(404).json({ message: 'Kayıt bulunamadı veya silinemedi' })
    }

    res.json({ message: 'Kayıt başarıyla silindi' })
  } catch (err) {
    console.error('Silme hatası:', err)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
});

module.exports = router
