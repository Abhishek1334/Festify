import dotenv from 'dotenv';
import process from 'process';
import app from './app.js';
import { log } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => log(`server up on :${PORT}`));
