import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async getUserProfile(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findUserTasks(@Param('id') id: string) {
    return this.userService.findUserTasks(id);
  }

  @UseGuards(JwtGuard)
  @Post(':userId/friends/:friendId')
  async addFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.addFriend(userId, friendId);
  }

  @UseGuards(JwtGuard)
  @Delete(':userId/friends/:friendId')
  async removeFriend(
    @Param('userId') userId: string,
    @Param('friendId') friendId: string,
  ) {
    return this.userService.removeFriend(userId, friendId);
  }

  @UseGuards(JwtGuard)
  @Get(':id/friends')
  async getFriends(@Param('id') id: string) {
    return this.userService.getFriends(id);
  }
}
