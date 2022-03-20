import manage from './manage.js';
import { port } from './variables.js';

const command = 'ascset';
const host = '192.168.1.6';
const args = [0, 'fan-spd', '43-100'];

manage(host, port, command, args);