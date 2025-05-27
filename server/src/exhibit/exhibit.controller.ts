import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ExhibitService } from './exhibit.service';
import { CreateExhibitDto, CreateFavoriteDto, Model3DDto } from './exhibit.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('exhibits')
export class ExhibitController {
  constructor(private readonly exhibitService: ExhibitService) {}

  // ! Add 3D model
  @Post('model3d/create')
  @UseInterceptors(
    FileInterceptor('model', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (file.fieldname === 'model') {
            cb(null, './public/uploads/models');
          } else {
            cb(new Error('Unknown field'), '');
          }
        },
        filename: (req, file, cb) => {
          const ext = extname(file.originalname).toLowerCase();
          const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
          cb(null, filename);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    }),
  )
  create3DModel(
    @Body() dto: Model3DDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.exhibitService.create3DModel(dto, file);
  }

  // ! create an exhibit
  @Post('create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 5 },
        { name: 'model', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: (req, file, cb) => {
            if (file.fieldname === 'images') {
              cb(null, './public/uploads/images');
            } else if (file.fieldname === 'model') {
              cb(null, './public/uploads/models');
            } else {
              cb(new Error('Unknown field'), '');
            }
          },
          filename: (req, file, cb) => {
            const ext = extname(file.originalname).toLowerCase();
            const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            cb(null, filename);
          },
        }),
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
      },
    ),
  )
  createExhibit(
    @Body() dto: CreateExhibitDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      model?: Express.Multer.File[];
    },
  ) {
    return this.exhibitService.createExhibit(dto, files);
  }

  @Get()
  getAllExhibits() {
    return this.exhibitService.getAllExhibits();
  }

  @Get('/get/:id')
  getExhibitById(@Param('id') id: number) {
    return this.exhibitService.getExhibitById(id);
  }

  @Get('/recommended')
  getRecommendedExhibits() {
    return this.exhibitService.getRecommendedExhibits();
  }

  @Delete('/delete/:id')
  deleteExhibit(@Param('id') id: number) {
    return this.exhibitService.deleteExhibit(id);
  }

  // ! get 3D model
  @Get('/model3d/:exhibitId')
  get3DModel(@Param('exhibitId') id: number) {
    return this.exhibitService.get3DModel(id);
  }

  // ? manage favorites
  @Post('/favorites/create')
  addToFavorites(@Body() dto: CreateFavoriteDto) {
    return this.exhibitService.addToFavorites(dto);
  }

  @Delete('/favorites/delete/:id')
  deleteFromFavorites(@Param('id') id: number) {
    return this.exhibitService.deleteFromFavorites(id);
  }

  @Get('/favorites/get/:userId')
  getFavoritedExhibits(
    @Param('userId') userId: number,
    // @Param('exhibitId') exhibitId: number,
  ) {
    return this.exhibitService.getFavoritedExhibits(userId);
  }

  // ! get all favorited
  @Get('/favorites/getAll')
  getAllFavoritedExhibits() {
    return this.exhibitService.getAllFavoritedExhibits();
  }

  // ? manage visits
  @Post('/visits/create')
  addToVisits(@Body() dto: CreateFavoriteDto) {
    return this.exhibitService.addToVisits(dto);
  }

  @Delete('/visits/delete/:id')
  deleteFromVisits(@Param('id') id: number) {
    return this.exhibitService.deleteFromVisits(id);
  }

  @Get('visits/:userId')
  getLatestVisits(@Param('userId') userId: number) {
    return this.exhibitService.getLatestVisits(userId);
  }

  // ? manage filters
  // todo: filterId = 1 => thematic , filterId = 2 => chronological
  @Get('/filters')
  getExhibitsByFilter() {
    return this.exhibitService.getExhibitsByFilter();
  }
}
