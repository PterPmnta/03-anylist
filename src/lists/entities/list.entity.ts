import { User } from './../../users/entities/user.entity';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
    Column,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

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
}
