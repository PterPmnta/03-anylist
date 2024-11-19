import { ObjectType, Field, ID } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
@ObjectType()
export class User {
    @PrimaryGeneratedColumn('uuid')
    @Field(() => ID)
    id: string;

    @Column()
    @Field(() => String)
    full_name: string;

    @Column({ unique: true })
    @Field(() => String)
    email: string;

    @Column()
    //@Field(() => String)
    password: string;

    @Column('text', { array: true, default: ['user'] })
    @Field(() => [String])
    roles: string[];

    @Column('boolean', { default: true })
    @Field(() => Boolean)
    is_active: boolean;

    @ManyToOne(() => User, (user) => user.last_updated_by, {
        nullable: true,
        lazy: true,
    })
    @JoinColumn({ name: 'last_updated_by' })
    @Field(() => User, { nullable: true })
    last_updated_by?: User;
}
