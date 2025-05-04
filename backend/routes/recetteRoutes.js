const express = require('express');
const router = express.Router();
const recetteController = require('../controllers/recetteController');
const { authenticateToken } = require('../controllers/authController');

// Create a new recette
router.post('/', authenticateToken, recetteController.createRecette);

// Get all recettes
router.get('/', recetteController.getAllRecettes);

// Get a single recette by id
router.get('/:id', authenticateToken, recetteController.getRecetteById);

// Update a recette
router.put('/:id', authenticateToken, recetteController.updateRecette);

// Delete a recette
router.delete('/:id', authenticateToken, recetteController.deleteRecette);

module.exports = router;
