import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { DynamicMulter } from '../../multer/multer.module';

@Module({
  imports: [DynamicMulter],
  providers: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {}
