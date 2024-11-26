import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {
    private isProd: boolean;

    constructor(private readonly configService: ConfigService) {
        this.isProd = this.configService.get('STATE') === 'prod';
    }

    async seedExecute() {
        try {
            //Limpiar DB
            if (this.isProd) {
                throw new UnauthorizedException('Is not able this function');
            }

            //Crear usuario

            //Crear items

            return true;
        } catch (error) {
            throw new Error(`Error al ejecutar la seed: ${error.message}`);
        }
    }
}
