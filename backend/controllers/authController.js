const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Fonction pour l'inscription
exports.register = async (req, res) => {
  try {
    const { username, phone, password, role, businessName, businessAddress } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      phone,
      password: hashedPassword,
      role,
      businessName: role === 'caterer' ? businessName : undefined,
      businessAddress: role === 'caterer' ? businessAddress : undefined
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fonction pour la connexion
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid phone or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid phone or password.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        username: user.username,
        phone: user.phone,
        role: user.role,
        businessName: user.businessName,
        businessAddress: user.businessAddress
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log('No token found');
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }
    console.log('Token verified, userId:', user.userId);
    req.userId = user.userId;
    next();
  });
};

exports.getProfile = async (req, res) => {
  try {
    console.log('Fetching profile for userId:', req.userId);
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      console.log('User not found for userId:', req.userId);
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    console.log('Updating profile for userId:', req.userId);
    const { username, phone, password, businessName, businessAddress } = req.body;
    const user = await User.findById(req.userId);
    if (!user) {
      console.log('User not found for userId:', req.userId);
      return res.status(404).json({ message: 'User not found.' });
    }

    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (user.role === 'caterer') {
      if (businessName) user.businessName = businessName;
      if (businessAddress) user.businessAddress = businessAddress;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
