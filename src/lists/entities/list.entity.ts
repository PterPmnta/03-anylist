import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class List {
    @Field(() => String, { description: 'Example field (placeholder)' })
    id: string;

    @Field(() => String)
    name: string;

    //Relacion, index('userId-list-index')

    user;
}
