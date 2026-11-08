import { createApp } from './app';
import { ENV } from './config/env';

const app = createApp();

app.listen(ENV.PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 YFT Backend running on http://localhost:${ENV.PORT}`);
  console.log(`📦 Environment: ${ENV.NODE_ENV}`);
  console.log(`📁 Uploads served from: ${ENV.UPLOAD_DIR}`);
  console.log(`===============================================`);
});
