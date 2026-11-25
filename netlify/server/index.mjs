import { getDatabase } from '@netlify/database';
import { createEnquiryHandler } from './enquiries.mjs';

export const config = { path: '/api/preview/enquiries' };

let sql;
export default createEnquiryHandler(() => sql ??= getDatabase().sql);
