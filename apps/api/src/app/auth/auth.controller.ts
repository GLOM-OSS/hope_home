import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Person } from '@prisma/client';
import { isEmail } from 'class-validator';
import { Request } from 'express';
import { ErrorEnum } from '../../errors';
import {
  ChangePasswordDto,
  CreateNewPasswordDto,
  CreatePersonDto,
  EditPersonDto,
  GoogleLoginDto,
} from './auth.dto';
import { AuthenticatedGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LocalGuard } from './local/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  @UseGuards(LocalGuard)
  async singIn(@Req() request: Request) {
    return request.user;
  }

  @Post('google')
  async googleSignIn(@Body() loginData: GoogleLoginDto) {
    try {
      return this.authService.googleSignIn(loginData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('register')
  async registerUser(
    @Req() request: Request,
    @Body() newPerson: CreatePersonDto
  ) {
    try {
      const person = await this.authService.registerUser(newPerson);
      await this.authService.login(request, person);
      return person;
    } catch (error) {
      throw new HttpException(
        `Oops, something when wrong: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('request-password')
  async requestPassword(@Body('email') email: string) {
    if (!isEmail(email))
      throw new HttpException(
        ErrorEnum.ERR1.toString(),
        HttpStatus.BAD_REQUEST
      );
    try {
      return await this.authService.generateNewPassword(email);
    } catch (error) {
      throw new HttpException(
        `Oops, something when wrong: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('change-password')
  @UseGuards(AuthenticatedGuard)
  async changePassword(
    @Req() request: Request,
    @Body() { current_password, new_password }: ChangePasswordDto
  ) {
    const { person_id, email } = request.user as Person;
    const user = await this.authService.validateUser(email, current_password);
    if (!user)
      throw new HttpException(ErrorEnum.ERR3, HttpStatus.NOT_ACCEPTABLE);
    return await this.authService.updateProfile(person_id, {
      password: new_password,
    });
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
  @UseGuards(AuthenticatedGuard)
  async getUser(@Req() request: Request) {
    return request.user;
  }

  @Put('user/edit')
  @UseGuards(AuthenticatedGuard)
  @UseInterceptors(FileInterceptor('profileImageRef'))
  async updateProfile(
    @Req() request: Request,
    @Body() newPerson: EditPersonDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { person_id } = request.user as Person;
    return await this.authService.updateProfile(person_id, {
      ...newPerson,
      profile_image_ref: file ? file.filename : undefined,
    });
  }
}
