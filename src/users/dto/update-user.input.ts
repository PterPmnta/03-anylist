import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { InputType, Field, PartialType } from '@nestjs/graphql';

import { CreateUserInput } from './create-user.input';
import { ValidRoles } from './../../auth/enums/valid-roles.enum';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
    @Field(() => String)
    @IsUUID()
    id: string;

    @Field(() => [ValidRoles], { nullable: true })
    @IsArray()
    @IsOptional()
    roles?: ValidRoles[] = [];

    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
}
