import { IsArray, IsEnum } from 'class-validator';
import { ValidRoles } from '../../../auth/enums/valid-roles.enum';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class ValidRolesArgs {
    @Field(() => [String], { nullable: true })
    @IsArray()
    //@IsEnum(ValidRoles)
    roles: string[] = [];
}
