import manage from './manage.js';
import { port } from './variables.js';

const command = 'ascset';
const host = '192.168.1.8';
const args = [0, 'hashpower', 0];

manage(host, port, command, args);