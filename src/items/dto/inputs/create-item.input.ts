import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    /* @Field(() => Float)
    @IsNotEmpty()
    @IsPositive()
    quantity: number; */

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    quantity_units?: string;
}
