import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';
import { ListItem } from './entities/list-item.entity';

import { ItemsModule } from './../items/items.module';
import { ListsModule } from './../lists/lists.module';

@Module({
    providers: [ListItemResolver, ListItemService],
    imports: [
        TypeOrmModule.forFeature([ListItem]),
        forwardRef(() => ListsModule),
        forwardRef(() => ItemsModule),
    ],
    exports: [ListItemService, TypeOrmModule],
})
export class ListItemModule {}
