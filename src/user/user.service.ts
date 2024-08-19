import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserDto } from 'src/dto//user.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (user) throw new ConflictException('email duplicated');

    const newUser = await this.prisma.user.create({
      data: {
        ...dto,
        name: dto.name.startsWith('@') ? dto.name : `@${dto.name}`,
        password: await hash(dto.password, 10),
      },
    });

    const { password, ...result } = newUser;
    return result;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }
  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findUserTasks(userId: string) {
    return this.prisma.cases.findMany({
      where: { authorId: userId },
    });
  }

  async addFriend(userId: string, friendName: string) {
    if (!friendName.startsWith('@')) {
      throw new ConflictException('Friend name must start with "@"');
    }

    const friend = await this.prisma.user.findFirst({
      where: { name: friendName },
    });

    if (!friend) {
      throw new NotFoundException('Friend not found');
    }

    if (userId === friend.id) {
      throw new ConflictException('Cannot add yourself as a friend');
    }

    const existingFriendship = await this.prisma.friend.findFirst({
      where: {
        userId,
        friendId: friend.id,
      },
    });

    if (existingFriendship) {
      throw new ConflictException('Friendship already exists');
    }

    return this.prisma.friend.create({
      data: {
        userId,
        friendId: friend.id,
      },
    });
  }

  async removeFriend(userId: string, friendId: string) {
    const friendship = await this.prisma.friend.findFirst({
      where: {
        userId,
        friendId,
      },
    });

    if (!friendship) {
      throw new NotFoundException('Friendship not found');
    }

    return this.prisma.friend.delete({
      where: {
        id: friendship.id,
      },
    });
  }

  async getFriendIds(userId: string) {
    const friends = await this.prisma.friend.findMany({
      where: {
        userId: userId,
      },
    });

    return friends.map((friend) => friend.friendId);
  }

  async getFriends(userId: string) {
    const friendIds = await this.getFriendIds(userId);
    const friends = await this.prisma.user.findMany({
      where: {
        id: {
          in: friendIds,
        },
      },
    });

    return friends;
  }
}
