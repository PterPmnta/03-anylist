import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { Item } from './entities/item.entity';

import { ListItemModule } from './../list-item/list-item.module';

@Module({
    providers: [ItemsResolver, ItemsService],
    imports: [TypeOrmModule.forFeature([Item]), ListItemModule],
    exports: [ItemsService, TypeOrmModule],
})
export class ItemsModule {}
