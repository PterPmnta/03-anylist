import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolesArgs } from './dto/args/role.arg';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) {}

    @Query(() => [User], { name: 'users' })
    async findAll(@Args() validRoles: ValidRolesArgs): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Query(() => User, { name: 'user' })
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.usersService.findOne(id);
    }

    /* @Mutation(() => User)
    updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        return this.usersService.update(updateUserInput.id, updateUserInput);
    } */

    @Mutation(() => User)
    blockUser(@Args('id', { type: () => ID }) id: string) {
        return this.usersService.block(id);
    }
}
