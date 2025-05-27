import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import {
  CheckExistingChatDto,
  CreateChatDto,
  CreateMessageDto,
} from './chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ? manage messages
  @Post('messages/create')
  createMessage(@Body() dto: CreateMessageDto) {
    return this.chatService.createMessage(dto);
  }

  @Get('messages/:chatId')
  getChatMessages(@Param('chatId') id: number) {
    return this.chatService.getChatMessages(id);
  }

  // ? manage chats
  @Post('create')
  createChat(@Body() dto: CreateChatDto) {
    return this.chatService.createChat(dto);
  }

  // ! delete a specific chat
  @Delete('delete/:id')
  deleteChatById(@Param('id') id: number) {
    return this.chatService.deleteChatById(id);
  }

  // ! delete all chat for a specific user
  @Delete('delete/all/:userId')
  deleteAllChats(@Param('userId') id: number) {
    return this.chatService.deleteAllChats(id);
  }

  // ! get all chats of a specific user
  @Get(':userId')
  getAllChats(@Param('userId') id: number) {
    return this.chatService.getAllChats(id);
  }

  // ! get latest chat or by id
  @Get('/latest/:userId/:id')
  getLatestChat(@Param('userId') userId: number, @Param('id') id: number) {
    return this.chatService.getLatestChat(userId, id);
  }

  // @Get('/currentChat/:id')
  // getCurrentChat(@Param('id') id: number) {
  //   return this.chatService.getCurrentChat(id);
  // }

  // ? manage history
  @Get('history/:userId')
  getHistory(@Param('userId') id: number) {
    return this.chatService.getHistory(id);
  }

  @Post('history/existingChat')
  checkExistingChat(@Body() dto: CheckExistingChatDto) {
    return this.chatService.checkExistingChat(dto);
  }
}
