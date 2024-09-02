import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req, res) => {
  const user = { id: 1, username: 'testuser' };
  const token = jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  res.json({ token });
});

export default router;