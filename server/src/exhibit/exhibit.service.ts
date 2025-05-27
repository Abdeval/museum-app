import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExhibitDto, CreateFavoriteDto, Model3DDto } from './exhibit.dto';

@Injectable()
export class ExhibitService {
  constructor(private prisma: PrismaService) {}

  // todo: create an exhibit
  async createExhibit(
    dto: CreateExhibitDto,
    files: {
      images?: Express.Multer.File[];
      model?: Express.Multer.File[];
    },
  ) {
    try {
      const images = files?.images?.map((i) => `/uploads/images/${i.filename}`);
      const model = files?.model?.map(
        (i) => `/uploads/models/${i.filename}`,
      )[0];
      if (model) {
        const res = await this.prisma.exhibit.create({
          data: {
            title: dto.title,
            description: dto.description,
            thematic_category: dto.thematic_category,
            chronological_category: dto.chronological_category,
            year: dto.year,
            images: {
              create: images?.map((i) => ({ url: i })),
            },
            model3D: {
              create: { fileUrl: model ? model : '' },
            },
          },
          include: {
            images: true,
            model3D: true,
          },
        });
        // console.log(res);
        return res;
      } else {
        const res = await this.prisma.exhibit.create({
          data: {
            title: dto.title,
            description: dto.description,
            thematic_category: dto.thematic_category,
            chronological_category: dto.chronological_category,
            year: dto.year,
            images: {
              create: images?.map((i) => ({ url: i })),
            },
          },
          include: {
            images: true,
            // model3D: true,
          },
        });
        // console.log(res);
        return res;
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

  // ! get an exhibit by id
  async getExhibitById(id: number) {
    try {
      const res = await this.prisma.exhibit.findUnique({
        where: {
          id,
        },
        include: {
          images: true,
          model3D: true,
        },
      });

      return res;
    } catch (err: any) {
      console.log(err);
      throw err;
    }
  }

  // ! delete
  async deleteExhibit(id: number) {
    const res = await this.prisma.exhibit.delete({
      where: {
        id,
      },
    });

    return res;
  }

  // ! get all exhibits

  async getAllExhibits() {
    return await this.prisma.exhibit.findMany({
      include: {
        images: true,
        model3D: true,
      },
    });
  }

  // todo: get recommended exhibits

  async getRecommendedExhibits() {
    try {
      const exhibits = await this.prisma.exhibit.findMany({
        include: {
          images: true,
          model3D: true,
          visits: true,
          favorites: true,
        },
      });

      const withScores = exhibits.map((e) => ({
        ...e,
        score: e.visits.length * 2 + e.favorites.length * 3,
      }));

      // Check if all scores are zero
      const allScoresZero = withScores.every((e) => e.score === 0);

      if (allScoresZero) {
        // Fallback: show newest exhibits
        const fallbackExhibits = await this.prisma.exhibit.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
          include: {
            images: true,
            model3D: true,
          },
        });

        return fallbackExhibits;
      }

      // Otherwise return top 5 by score
      return withScores.sort((a, b) => b.score - a.score).slice(0, 5);
    } catch (err) {
      console.error('Error fetching recommended exhibits:', err);
      throw err;
    }
  }

  // ! create a 3 model
  async create3DModel(dto: Model3DDto, file: Express.Multer.File) {
    const fileUrl = `/uploads/models/${file.filename}`;
    console.log('creating the model:', fileUrl);
    const res = await this.prisma.model3D.create({
      data: {
        fileUrl,
        exhibitId: Number(dto.exhibitId),
      },
    });
    return res;
    // return Promise.resolve();
  }

  // ! get 3D model by exhibit id
  async get3DModel(exhibitId: number) {
    const res = await this.prisma.model3D.findUnique({
      where: {
        exhibitId,
      },
    });

    return res;
  }

  // ? favorites
  // todo: add to favorites
  async addToFavorites(dto: CreateFavoriteDto) {
    try {
      const res = await this.prisma.favorite.create({
        data: {
          userId: dto.userId,
          exhibitId: dto.exhibitId,
        },
      });

      return res;
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  }

  // ! delete from favorites
  async deleteFromFavorites(id: number) {
    const res = await this.prisma.favorite.delete({
      where: {
        id,
      },
    });

    return res;
  }

  // ! get favorited exhibits by a user
  async getFavoritedExhibits(userId: number) {
    const res = await this.prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        exhibit: {
          include: {
            images: true,
          },
        },
      },
    });

    // console.log('favorites:', res);

    return res;
  }

  // ! get all favorites for admin usage
  async getAllFavoritedExhibits() {
    const res = await this.prisma.favorite.findMany({
      include: {
        exhibit: {
          include: {
            images: true,
          },
        },
      },
    });

    return res;
  }

  // ? manage visits
  // ! add to visits
  async addToVisits(dto: CreateFavoriteDto) {
    const res = await this.prisma.visit.upsert({
      where: {
        userId_exhibitId: {
          userId: dto.userId,
          exhibitId: dto.exhibitId,
        },
      },
      update: {
        visitedAt: new Date(),
      },
      create: {
        userId: dto.userId,
        exhibitId: dto.exhibitId,
        visitedAt: new Date(),
        // Add any other required fields for the visit model
      },
    });
    return res;
  }

  // ! delete from visits
  async deleteFromVisits(id: number) {
    const res = await this.prisma.visit.delete({
      where: {
        id,
      },
    });

    return res;
  }

  // ! GET latest visits
  async getLatestVisits(userId: number) {
    const dailyVisits: any = await this.prisma.$queryRaw`
      SELECT 
      "userId",
      DATE("visitedAt") AS "visitedAt",
      ARRAY_AGG("exhibitId") AS "exhibitIds",
      COUNT("exhibitId") AS "exhibitNumber"
      FROM "Visit"
      WHERE "userId" = ${userId}
      GROUP BY "userId", DATE("visitedAt")
      ORDER BY DATE("visitedAt") DESC;
    `;

    const converted = dailyVisits.map((row) => ({
      ...row,
      exhibitNumber: Number(row.exhibitNumber),
    }));

    console.log('visits:', converted);

    return converted;
  }

  // ? manage filters

  async getExhibitsByFilter() {
    return {
      thematic: await this.getThematicExhibits(),
      chronological: await this.getChronologicalExhibits(),
    };
  }

  async getThematicExhibits() {
    const exhibits = await this.prisma.exhibit.findMany({
      select: {
        id: true,
        thematic_category: true,
      },
    });

    const grouped = exhibits.reduce(
      (acc, exhibit) => {
        const categoryName = exhibit.thematic_category;

        const existingCategory = acc.find((c) => c.name === categoryName);
        if (existingCategory) {
          existingCategory.exhibits.push(exhibit.id);
        } else {
          acc.push({ name: categoryName, exhibits: [exhibit.id] });
        }

        return acc;
      },
      [] as { name: string; exhibits: number[] }[],
    );

    return grouped;
  }

  async getChronologicalExhibits() {
    const exhibits = await this.prisma.exhibit.findMany({
      select: {
        id: true,
        chronological_category: true,
      },
    });

    const grouped = exhibits.reduce(
      (acc, exhibit) => {
        const categoryName = exhibit.chronological_category;

        const existingCategory = acc.find((c) => c.name === categoryName);
        if (existingCategory) {
          existingCategory.exhibits.push(exhibit.id);
        } else {
          acc.push({ name: categoryName, exhibits: [exhibit.id] });
        }

        return acc;
      },
      [] as { name: string; exhibits: number[] }[],
    );

    return grouped;
  }
}
