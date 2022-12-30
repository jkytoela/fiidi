import startApp from './app';

try {
  startApp();
} catch (error) {
  console.error(`Error starting app: ${error}`);
}
