import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedService {
    constructor() {}

    async seedExecute() {
        try {
            //Limpiar DB

            //Crear usuario

            //Crear items

            return true;
        } catch (error) {
            throw new Error(`Error al ejecutar la seed: ${error.message}`);
        }
    }
}
