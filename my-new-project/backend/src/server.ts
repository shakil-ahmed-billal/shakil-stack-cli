import { Server } from 'http';
import app from './app.js';
import config from './app/config/index.js';

let server: Server;

async function bootstrap() {
  try {
    server = app.listen(config.port, () => {
      console.log(`my-new-project server is listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}

bootstrap();
