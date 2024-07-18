const express = require('express');
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/users', userController.createUser);
router.get('/users', authenticateJWT, userController.getUsers);
router.put('/users/:id', authenticateJWT, userController.updateUser);
router.delete('/users/:id', authenticateJWT, userController.deleteUser);

module.exports = router;
