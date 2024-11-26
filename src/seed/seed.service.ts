import { User } from './../users/entities/user.entity';
import { Item } from './../items/entities/item.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
    private readonly isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async seedExecute() {
        try {
            //Limpiar DB
            if (this.isProd) {
                throw new UnauthorizedException('Is not able this function');
            }

            await this.deleteDatabase();

            //Crear usuario

            //Crear items

            return true;
        } catch (error) {
            throw new Error(`Error al ejecutar la seed: ${error.message}`);
        }
    }

    async deleteDatabase() {
        await this.itemsRepository
            .createQueryBuilder()
            .delete()
            .where({})
            .execute();

        await this.userRepository
            .createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }
}
