import { Module } from '@nestjs/common';
import { BcryptService } from './infraestructure/services/bcrypt/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './infraestructure/services/jwt/jwt.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '24h' },
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: 60000,
                    limit: 10,
                },
            ],
        }),
    ],
    controllers: [],
    providers: [
        BcryptService,
        JwtTokenService
    ],
    exports: [BcryptService, JwtTokenService]
})
export class SharedModule { }
