import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Person } from '@prisma/client';
import { Request } from 'express';
import { CreatePersonDto, GoogleLoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalGuard)
  async singIn(@Req() request: Request) {
    const accessToken = this.authService.signIn(request.user as Person);
    return { access_token: accessToken };
  }

  @Post('google')
  async googleSignIn(@Body() loginData: GoogleLoginDto) {
    const person = await this.authService.googleSignIn(loginData);
    const accessToken = this.authService.signIn(person);
    return { access_token: accessToken };
  }

  @Post('register')
  async registerUser(@Body() newPerson: CreatePersonDto) {
    const person = await this.authService.registerUser(newPerson);
    const accessToken = this.authService.signIn(person);
    return { access_token: accessToken };
  }
}
