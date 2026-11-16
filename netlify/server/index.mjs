import { db } from '../../db/index.mjs';
import { createApp } from './app.mjs';
export const config = { path: '/api/*' };
export default createApp(db);
