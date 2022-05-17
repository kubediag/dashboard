import ENV from './config/config.dotenv';
import app from './app/index';

app.listen(ENV.PORT, () => {
  console.log(`The service starting: http://localhost:${ENV.PORT as string}`);
});
