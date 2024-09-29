import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Controller,
  Get,
  HttpException,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { SystemLoggerService } from './system-logger.service';

@UseGuards(JwtAuthGuard)
@ApiTags('system-logger')
@Controller('system-logger')
export class SystemLoggerController {
  constructor(private readonly systemLoggerService: SystemLoggerService) {}

  @Roles(Role.SuperAdmin)
  @Get('')
  async getSystemLogger() {
    return this.systemLoggerService.getSystemLogger();
  }

  @Roles(Role.SuperAdmin)
  @Get('export-text')
  async exportSystemLoggerToText(@Res() response: FastifyReply) {
    const result = await this.systemLoggerService.exportSystemLoggerToText();
    let fileName;
    if (result.includes('\\')) {
      fileName = result.split('\\').pop();
    } else if (result.includes('/')) {
      fileName = result.split('/').pop();
    } else {
      fileName = result;
    }
    response.header('Content-Type', 'text/plain');
    response.header('Content-Disposition', 'attachment; filename=' + fileName);
    response.send(fs.createReadStream(result));
  }
  // @Roles(Role.SuperAdmin)
  // @Get('export-excel')
  // async exportSystemLoggerToExcel(@Res() response: FastifyReply) {
  //   const result = await this.systemLoggerService.exportSystemLoggerToExcel();
  //   let fileName;
  //   if (result.includes('\\')) {
  //     fileName = result.split('\\').pop();
  //   } else if (result.includes('/')) {
  //     fileName = result.split('/').pop();
  //   } else {
  //     fileName = result;
  //   }
  //   response.header(
  //     'Content-Type',
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //   );
  //   response.header('Content-Disposition', 'attachment; filename=' + fileName);
  //   response.send(fs.createReadStream(result));
  // }

  @Roles(Role.SuperAdmin)
  @Get('users')
  async getSystemLoggerUsersByIds(@Query('user-ids') userIds: string) {
    return this.systemLoggerService.getSystemLoggerUsersByIds(userIds);
  }

  @Roles(Role.SuperAdmin)
  @Get('user')
  async getSystemLoggerUserById(
    @Query('user-id', ParseIntPipe) userId: number,
  ) {
    return this.systemLoggerService.getSystemLoggerUserById(userId);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Roles(Role.SuperAdmin)
  @Post('upload/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Logs/',
        filename: function (req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, file.originalname + randomName);
        },
      }),
    }),
  )
  async Upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          // fileType: 'application/pdf',
          fileType: 'application/octet-stream',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: File,
  ) {
    const fileLocation = `uploads/Logs/${file.filename}`;
    try {
      var result = await this.systemLoggerService.uploadSystemLoggerFile(
        fileLocation,
      );
      return result.name;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error From Google Bucket :: ' + error, 600);
    }
  }
}
