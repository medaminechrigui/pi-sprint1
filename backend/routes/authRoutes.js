const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = authController;

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour la connexion
router.post('/login', authController.login);

// Route pour obtenir le profil utilisateur (protégée)
router.get('/profile', authenticateToken, authController.getProfile);

// Route pour mettre à jour le profil utilisateur (protégée)
router.put('/profile', authenticateToken, authController.updateProfile);

module.exports = router;
