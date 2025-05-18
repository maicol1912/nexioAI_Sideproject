import { Module } from '@nestjs/common';
import { BcryptService } from './infraestructure/services/bcrypt/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './infraestructure/services/jwt/jwt.service';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
    ],
    controllers: [],
    providers: [BcryptService, JwtTokenService],
    exports: [BcryptService, JwtTokenService]
})
export class SharedModule { }
