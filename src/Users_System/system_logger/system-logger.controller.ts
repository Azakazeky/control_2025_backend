import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Controller,
  Get,
  HttpException,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Query,
  Req,
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
import { SystemLoggerService } from './system-logger.service';

@UseGuards(JwtAuthGuard)
@ApiTags('system-logger')
@Controller('system-logger')
export class SystemLoggerController {
  constructor(private readonly systemLoggerService: SystemLoggerService) {}

  // @Roles(Role.SuperAdmin)
  @Get('')
  /**
   * Returns the system logger.
   *
   * @returns {Promise<SystemLogger[]>}
   */
  async getSystemLogger() {
    return this.systemLoggerService.getSystemLogger();
  }

  // @Roles(Role.SuperAdmin)
  @Get('export-text')
  /**
   * Exports the system logger to a text file.
   *
   * @returns {Promise<void>}
   */
  async exportSystemLoggerToText(@Res() response: FastifyReply) {
    const result = await this.systemLoggerService.exportSystemLoggerToText();
    let fileName: string;
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
  @Get('reset-and-export-text')
  /**
   * Resets the system logger and exports it to a text file.
   *
   * @returns {Promise<void>}
   */
  async resetAndExportSystemLoggerToText(
    @Req() req: Request,
    @Res() response: FastifyReply,
  ) {
    const userId = req.headers['user']['userId'];
    const result =
      await this.systemLoggerService.resetAndExportSystemLoggerToText(+userId);
    let fileName: string;
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
  @Get('export-excel')
  /**
   * Exports the system logger to an excel file.
   *
   * @returns {Promise<void>}
   */
  async exportSystemLoggerToExcel(@Res() response: FastifyReply) {
    const result = await this.systemLoggerService.exportSystemLoggerToExcel();
    let fileName: string;
    if (result.includes('\\')) {
      fileName = result.split('\\').pop();
    } else if (result.includes('/')) {
      fileName = result.split('/').pop();
    } else {
      fileName = result;
    }
    response.header(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    response.header('Content-Disposition', 'attachment; filename=' + fileName);
    response.send(fs.createReadStream(result));
  }

  // @Roles(Role.SuperAdmin)
  @Get('users')
  /**
   * Returns a list of users based on the user-ids query parameter.
   *
   * @param userIds a comma-separated list of user-ids
   *
   * @returns {Promise<User[]>}
   */
  async getSystemLoggerUsersByIds(@Query('user-ids') userIds: string) {
    return this.systemLoggerService.getSystemLoggerUsersByIds(userIds);
  }

  // @Roles(Role.SuperAdmin)
  @Get('user')
  /**
   * Returns a user based on the user-id query parameter.
   *
   * @param userId The user-id of the user to find.
   *
   * @returns {Promise<User>}
   */
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
  // @Roles(Role.SuperAdmin)
  @Post('upload/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Logs/',
        filename: function (
          req: any,
          file: { originalname: string },
          callback: (arg0: null, arg1: string) => void,
        ) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, file.originalname + randomName);
        },
      }),
    }),
  )
  /**
   * Uploads a system logger file to the Google Cloud Storage bucket and returns the uploaded file name.
   * @param file the file to be uploaded
   * @returns the uploaded file name
   * @throws {HttpException} if an error occurs while uploading the file to the Google Cloud Storage bucket
   */
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
