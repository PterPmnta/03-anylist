import { User } from './../../users/entities/user.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
    Column,
    Entity,
    Index,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { ListItem } from './../../list-item/entities/list-item.entity';

@Entity('list')
@ObjectType()
export class List {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column()
    name: string;

    //Relacion, index('userId-list-index')
    @ManyToOne(() => User, (user) => user.lists, {
        nullable: false,
        lazy: true,
    })
    @Index('userId-list-index')
    @Field(() => User)
    user: User;

    @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
    //@Field(() => [ListItem])
    listItem: ListItem[];
}
