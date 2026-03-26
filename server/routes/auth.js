import { Router } from 'express';
import { createUser, findUserByEmail, verifyUserCredentials } from '../models/users.js';

const authRouter = Router();

const isValidEmail = (email) => typeof email === 'string' && email.includes('@');

authRouter.post('/signup', async (req, res) => {
  const { name, age, email, password, avatar = '🤖', parentalConsent = false } = req.body ?? {};

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Name is required.' });
  }

  if (!Number.isInteger(age) || age < 5 || age > 18) {
    return res.status(400).json({ error: 'Age must be between 5 and 18.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }

  if (typeof password !== 'string' || password.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters.' });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }

  const user = await createUser({
    name: name.trim(),
    age,
    email,
    password,
    avatar,
    parentalConsent,
  });

  return res.status(201).json({ user });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!isValidEmail(email) || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = await verifyUserCredentials(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  return res.json({ user });
});

export default authRouter;
