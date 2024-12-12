import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

import { List } from './entities/list.entity';

import { ListItemModule } from './../list-item/list-item.module';

@Module({
    providers: [ListsResolver, ListsService],
    imports: [
        TypeOrmModule.forFeature([List]),
        forwardRef(() => ListItemModule),
    ],
    exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
