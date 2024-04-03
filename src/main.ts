import { servicesResolver } from "./providers";
import { startServer } from "./server";

async function bootstrap() {
  const services = await servicesResolver();
  await startServer(services);
}

bootstrap();
