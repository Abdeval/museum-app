import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto, CreateMessageDto } from './chat.dto';
import { Message } from 'generated/prisma';
import { ChatHistoryItemType, GroupedChats } from 'src/lib/types';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(dto: CreateChatDto) {
    const { userId, title } = dto;

    const chat = await this.prisma.chat.create({
      data: {
        user: { connect: { id: userId } },
        title: title,
        // messages: {
        //   create: messages.map(
        //     (
        //       message: { content: string; type: 'BOT' | 'USER' },
        //       index: number,
        //     ) => ({
        //       content: message.content,
        //       sender: message.type,
        //     }),
        //   ),
        // },
      },
      include: {
        messages: true,
      },
    });

    return chat;
  }

  // ! delete chat by id
  async deleteChatById(id: number) {
    return await this.prisma.chat.delete({
      where: {
        id,
      },
    });
  }

  // ! delete all chats of a specific user
  async deleteAllChats(id: number) {
    return await this.prisma.chat.deleteMany({
      where: {
        userId: id,
      },
    });
  }

  // ! get all chats of a specific user
  async getAllChats(id: number) {
    return await this.prisma.chat.findMany({
      where: {
        userId: id,
      },
      include: {
        messages: true,
      },
    });
  }

  // ! get the latest chat or by id
  async getLatestChat(userId: number, id: number) {
    try {
      console.log('latest...');
      if (id) {
        const res = await this.prisma.chat.findUnique({
          where: {
            id,
            userId,
          },
        });
        return res;
      } else {
        const res = await this.prisma.chat.findMany({
          where: {
            userId,
          },
          orderBy: {
            startedAt: 'desc',
          },
          take: 1,
          // include: {
          //   messages: true,
          // },
        });
        return res ? res[0] : null;
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

  // // ! get current chat
  // async getCurrentChat(id: number) {
  //   try {
  //     const res = await this.prisma.chat.findUnique({
  //       where: {
  //         id,
  //       },
  //       // include: {
  //       //   messages: true,
  //       // },
  //     });
  //     return res;
  //   } catch (err: any) {
  //     console.error(err);
  //     throw err;
  //   }
  // }

  // ? manage messages
  async createMessage(dto: CreateMessageDto) {
    const { chatId, content, type, isFirstMessage, exhibits } = dto;

    // Guard clause for required fields
    if (!chatId) {
      console.error('Chat ID is missing in DTO:', dto);
      throw new ForbiddenException('Chat ID is required.');
    }

    if (!content) {
      console.error('Message content is missing in DTO:', dto);
      throw new ForbiddenException('Message content cannot be empty.');
    }

    try {
      console.log(' Creating message with data:', dto);
      let message;
      if (exhibits) {
        message = await this.prisma.message.create({
          data: {
            chatId,
            content,
            sender: type,
            isVoice: false,
            recommendations: {
              create: exhibits?.map((exhibitId) => ({
                exhibit: { connect: { id: exhibitId } },
              })),
            },
          },
        });
      } else {
        message = await this.prisma.message.create({
          data: {
            chatId,
            content,
            sender: type,
            isVoice: false,
          },
        });
      }

      console.log('Message created successfully:', message);

      return message;
    } catch (error) {
      console.error('Failed to create message:', {
        dto,
        error: error.message || error,
      });

      // Optional: throw a generic internal server error
      throw new Error('Could not create message. Please try again.');
    }
  }

  async getChatMessages(id: number) {
    const res = await this.prisma.message.findMany({
      where: {
        chatId: id,
      },
      include: {
        recommendations: {
          include: {
            exhibit: {
              include: {
                images: true,
              },
            },
          },
        },
      },
    });

    const messages = res.map((message) => {
      const { recommendations, ...rest } = message;
      const exhibits = recommendations.map((rec) => rec.exhibit);
      return { ...rest, exhibits };
    });
    console.log('messages:', messages);

    return messages;
  }

  // ? manage history

  async getHistory(id: number) {
    const chats = await this.prisma.chat.findMany({
      where: {
        userId: id,
      },
      include: {
        messages: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // ! Group chats by date
    const todayChats: ChatHistoryItemType[] = [];
    const yesterdayChats: ChatHistoryItemType[] = [];
    const previousChats: ChatHistoryItemType[] = [];

    chats.forEach((chat: any) => {
      const chatDate = new Date(chat);
      const preview =
        chat.messages && chat.messages.length > 0
          ? chat.messages[0].content.substring(0, 40) +
            (chat.messages[0].content.length > 40 ? '...' : '')
          : 'New conversation';

      // ! Determine if any messages were voice messages
      const hasVoiceMessages =
        chat.messages?.some((msg: Message) => msg.isVoice) || false;

      const historyItem: ChatHistoryItemType = {
        id: chat.id,
        preview,
        timestamp: chatDate,
        isVoice: hasVoiceMessages,
      };

      if (chatDate >= today) {
        todayChats.push(historyItem);
      } else if (chatDate >= yesterday) {
        yesterdayChats.push(historyItem);
      } else {
        previousChats.push(historyItem);
      }
    });

    // ! Create the grouped data structure
    const grouped: GroupedChats[] = [];

    if (todayChats.length > 0) {
      grouped.push({ title: 'Today', data: todayChats });
    }

    if (yesterdayChats.length > 0) {
      grouped.push({ title: 'Yesterday', data: yesterdayChats });
    }

    if (previousChats.length > 0) {
      grouped.push({ title: 'Previous', data: previousChats });
    }

    console.log('Grouped chats:', grouped);

    return grouped;
  }
}
