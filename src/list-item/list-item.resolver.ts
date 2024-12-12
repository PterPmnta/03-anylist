import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';

import { User } from './../users/entities/user.entity';

import { CurrentUser } from './../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
    constructor(private readonly listItemService: ListItemService) {}

    @Mutation(() => ListItem)
    createListItem(
        @Args('createListItemInput') createListItemInput: CreateListItemInput,
        //@CurrentUser() user: User,
        // Solicitar el usuario para validar
    ): Promise<ListItem> {
        return this.listItemService.create(createListItemInput);
    }

    /* @Query(() => [ListItem], { name: 'listItem' })
    findAll() {
        return this.listItemService.findAll();
    } */

    @Query(() => ListItem, { name: 'listItem' })
    findOne(
        @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    ): Promise<ListItem> {
        return this.listItemService.findOne(id);
    }

    @Mutation(() => ListItem)
    updateListItem(
        @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
    ) {
        return this.listItemService.update(
            updateListItemInput.id,
            updateListItemInput,
        );
    }

    /*

  @Mutation(() => ListItem)
  removeListItem(@Args('id', { type: () => Int }) id: number) {
    return this.listItemService.remove(id);
  } */
}
