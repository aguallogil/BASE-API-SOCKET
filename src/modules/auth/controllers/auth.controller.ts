import { Controller, Get, Post, Body, HttpCode, UnauthorizedException } from '@nestjs/common';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SessionService } from 'src/modules/session/services/session.service';
@Controller('auth')
export class AuthController {
    constructor(
        private userService: UserService, private authService: AuthService,
        private sessionsService: SessionService,
    ) {

    }
    @Post('login')
    @HttpCode(200)
    async login(@Body() data: User) {
        const user = await this.userService.getUser(data);

        if (user) {
            // Genera el token de acceso (JWT) utilizando el userId
            const accessToken = await this.authService.generateToken({ userId: user._id });

            // Crea una sesión de tipo 'http' para la autenticación
            await this.sessionsService.createSession(user._id, accessToken, 'http');

            // Devuelve el accessToken y el userId
            return {
                accessToken
            };
        }

        // Si las credenciales no son válidas, lanza una excepción de autenticación
        throw new UnauthorizedException('Credenciales inválidas');
    }
}