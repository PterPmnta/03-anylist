import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
    @Field(() => String)
    @IsEmail()
    email: string;

    @Field(() => String)
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
