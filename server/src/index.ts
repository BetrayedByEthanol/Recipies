import { validateAuthConfig } from './config';
import { createApp } from './app';

validateAuthConfig();

const PORT = parseInt(process.env.PORT ?? '3001', 10);

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
