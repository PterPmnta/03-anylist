import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
    constructor(private readonly seedService: SeedService) {}

    @Mutation(() => Boolean, {
        name: 'executeSeed',
        description: 'Ejecuta la seed',
    })
    executeSeed(): Promise<boolean> {
        return this.seedService.seedExecute();
    }
}
