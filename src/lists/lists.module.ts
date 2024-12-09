import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ListsResolver } from './lists.resolver';
import { ListsService } from './lists.service';

import { List } from './entities/list.entity';

@Module({
    providers: [ListsResolver, ListsService],
    imports: [TypeOrmModule.forFeature([List])],
    exports: [ListsService, TypeOrmModule],
})
export class ListsModule {}
