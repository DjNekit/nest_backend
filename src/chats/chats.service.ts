import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Chat } from "./entity/chat.entity";
import { User } from "../users/entity/user.entity";
import { UsersService } from "src/users/users.service";
import { Message } from "./entity/message.entity";

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    // private usersRepository: Repository<User>,
    private usersService: UsersService
  ) { }

  async getChatsIds(userId: number) {
    const chatIds = await this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.members', 'user')
      .where('user.id = :id', { id: userId })
      .select('chat.id')
      .getMany()

    return chatIds
  }

  async getChats(userId: number) {
    const chats = await this.chatsRepository
      .createQueryBuilder('chat')
      .leftJoin('chat.members', 'user')
      .where('user.id = :id', { id: userId })
      .leftJoinAndSelect('chat.members', 'user2')
      .where('user2.id != :userId', { userId })
      .leftJoinAndSelect('chat.messages', 'message')
      .select('')
      .orderBy('message.created_date', 'ASC')
      .addOrderBy('chat.created_date', 'DESC')
      .getMany()

    return chats
  }

  async saveMessage(data) {
    const { id, chatId, content, author_id, status } = data

    const newMessage = new Message()
    newMessage.id = id
    newMessage.content = content
    newMessage.chat = chatId
    newMessage.author_id = author_id
    newMessage.status = status

    await this.chatsRepository
      .createQueryBuilder()
      .insert()
      .into(Message)
      .values(newMessage)
      .execute()
  }

  async findOrCreateChat(userId, companionId) {
    this.chatsRepository
      .createQueryBuilder()


    return {

    }
  }
}