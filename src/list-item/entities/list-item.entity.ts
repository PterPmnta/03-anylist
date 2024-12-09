import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { List } from './../../lists/entities/list.entity';
import { Item } from './../../items/entities/item.entity';

@Entity('list_item')
@ObjectType()
export class ListItem {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Number)
    @Column({ type: 'numeric' })
    quantity: number;

    @Field(() => Boolean)
    @Column({ type: 'boolean' })
    completed: boolean;

    /* list: List;

    item: Item; */
}
