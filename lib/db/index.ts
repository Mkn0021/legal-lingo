import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@libsql/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const db = createClient({
    url: `file:${path.join(__dirname, 'legal_terms.db')}`,
});