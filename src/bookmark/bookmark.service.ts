import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditbookmarkDto } from './dtos';

@Injectable()
export class BookmarkService {
  constructor(public prismaService: PrismaService) {}
  public async getBookmarks(userId: number) {
    return await this.prismaService.bookmark.findMany({
      where: { userId },
    });
  }

  public async getBookmarksById(userId: number, bookmarkId: number) {
    return await this.prismaService.bookmark.findFirst({
      where: { userId, id: bookmarkId },
    });
  }

  public async createBookmark(userId: number, dto: CreateBookmarkDto) {
    return await this.prismaService.bookmark.create({
      data: { userId, ...dto },
    });
  }

  public async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditbookmarkDto,
  ) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied');
    return await this.prismaService.bookmark.update({
      where: { id: bookmarkId },
      data: { ...dto },
    });
  }

  public async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = await this.prismaService.bookmark.findUnique({
      where: { id: bookmarkId },
    });
    if (!bookmark || bookmark.userId !== userId)
      throw new ForbiddenException('Access to resource denied');
    await this.prismaService.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
