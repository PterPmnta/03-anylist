import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    full_name: string;

    @Field(() => String)
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
