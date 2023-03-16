import { MulterModule } from '@nestjs/platform-express';
import { MulterService } from './multer.service';

export const DynamicMulter = MulterModule.registerAsync({
  useClass: MulterService,
});
