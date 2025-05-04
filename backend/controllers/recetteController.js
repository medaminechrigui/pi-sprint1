
const Recette = require('../models/Recette');

// Create a new recette
exports.createRecette = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const newRecette = new Recette({
      title,
      description,
      userId,
    });

    await newRecette.save();
    res.status(201).json(newRecette);
  } catch (error) {
    console.error('Error creating recette:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all recettes
exports.getAllRecettes = async (req, res) => {
  try {
    const recettes = await Recette.find().populate('userId', 'username').populate('favorites', '_id');
    res.json(recettes);
  } catch (error) {
    console.error('Error fetching recettes:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get a single recette by id
exports.getRecetteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const recette = await Recette.findById(id).populate('userId', 'username');
    if (!recette) {
      return res.status(404).json({ message: 'Recette not found.' });
    }

    if (recette.userId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to view this recette.' });
    }

    res.json(recette);
  } catch (error) {
    console.error('Error fetching recette:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update a recette
exports.updateRecette = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.userId;

    const recette = await Recette.findById(id);
    if (!recette) {
      return res.status(404).json({ message: 'Recette not found.' });
    }

    if (recette.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Unauthorized to update this recette.' });
    }

    if (title) recette.title = title;
    if (description) recette.description = description;

    await recette.save();
    res.json(recette);
  } catch (error) {
    console.error('Error updating recette:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete a recette
exports.deleteRecette = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    console.log('Delete recette request by userId:', userId, 'for recette id:', id);

    const recette = await Recette.findById(id);
    if (!recette) {
      console.log('Recette not found for id:', id);
      return res.status(404).json({ message: 'Recette not found.' });
    }

    console.log('Recette userId:', recette.userId.toString());

    if (recette.userId.toString() !== userId) {
      console.log('Unauthorized delete attempt by userId:', userId);
      return res.status(403).json({ message: 'Unauthorized to delete this recette.' });
    }

    await Recette.findByIdAndDelete(id);
    res.json({ message: 'Recette deleted successfully.' });
  } catch (error) {
    console.error('Error deleting recette:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
