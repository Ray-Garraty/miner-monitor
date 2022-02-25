import manage from './manage.js';
import { port } from './variables.js';

const command = 'ascset';
const host = '';
const args = [0, 'fan-spd', '46-100'];

manage(host, port, command, args);