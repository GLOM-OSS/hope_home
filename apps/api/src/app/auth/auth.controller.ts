import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Person } from '@prisma/client';
import { isEmail } from 'class-validator';
import { Request } from 'express';
import { ErrorEnum } from '../../errors';
import {
  CreateNewPasswordDto,
  CreatePersonDto,
  EditPersonDto,
  GoogleLoginDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';
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
    try {
      const person = await this.authService.googleSignIn(loginData);
      const accessToken = this.authService.signIn(person);
      return { access_token: accessToken };
    } catch (error) {
      throw new HttpException(
        `Oops, something when wrong: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('register')
  async registerUser(@Body() newPerson: CreatePersonDto) {
    try {
      const person = await this.authService.registerUser(newPerson);
      const accessToken = this.authService.signIn(person);
      return { access_token: accessToken };
    } catch (error) {
      throw new HttpException(
        `Oops, something when wrong: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('reset-password')
  async resetPassword(@Body('email') email: string) {
    if (!isEmail(email))
      throw new HttpException(
        ErrorEnum.ERR1.toString(),
        HttpStatus.BAD_REQUEST
      );
    try {
      return await this.authService.resetPassword(email);
    } catch (error) {
      throw new HttpException(
        `Oops, something when wrong: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('new-password')
  async setNewPassword(@Body() newPassword: CreateNewPasswordDto) {
    try {
      await this.authService.setNewPassword(newPassword);
    } catch (error) {
      throw new HttpException(
        `Oops, something when wrong: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Req() request: Request) {
    return request.user;
  }

  @Put('user/edit')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() request: Request,
    @Body () newPerson: EditPersonDto
  ) {
    const { person_id } = request.user as Person;
    return await this.authService.updateProfile(person_id, newPerson);
  }
}
