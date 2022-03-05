import manage from './manage.js';
import { port } from './variables.js';

const command = 'ascset';
const host = '192.168.1.7';
const args = [0, 'fan-spd', '41-100'];

manage(host, port, command, args);