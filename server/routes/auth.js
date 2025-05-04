const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })
  if (!user) return res.status(401).json({ message: 'Kullanıcı bulunamadı' })

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) return res.status(401).json({ message: 'Şifre yanlış' })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' })

  res.status(200).json({
    message: 'Giriş başarılı',
    token,
    userId: user._id
  })
})


router.post('/register', async (req, res) => {
  const { username, password } = req.body
  const existing = await User.findOne({ username })
  if (existing) return res.status(400).json({ message: 'Kullanıcı zaten var' })

  const passwordHash = await bcrypt.hash(password, 10)
  const newUser = new User({ username, passwordHash })
  await newUser.save()
  res.status(201).json({ message: 'Kayıt başarılı' })
})

module.exports = router
