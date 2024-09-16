import { Controller, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import * as path from 'path';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { GeneratePdfService } from './generate_pdf.service';
const fs = require('fs');

@UseGuards(PrismaExceptionFilter)
@ApiTags('Generate-PDF')
@Controller('generate-pdf')
export class GeneratePdfController {
  constructor(private readonly generatePdfService: GeneratePdfService) {}

  @ApiQuery({
    name: 'gradeid',
    required: false,
    type: Number,
  })
  @Get('/seats/:id?')
  async generateseats(
    @Param('id') id: string,
    @Query('gradeid') gradeId,
    @Res() response: FastifyReply,
  ) {
    console.log('mission id' + id);
    console.log('grade id : ' + gradeId);
    try {
      console.log('start generate');
      var result = await this.generatePdfService.generatSeatNumber(
        +id,
        +gradeId,
      );
      const filePath = path.join(__dirname, '../../../..', result);
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + result.split('/').pop(),
      );
      response.send(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(201).send({ status: false });
    }
  }
  @Get('/am-cover/:id/')
  async generateAmircanCovers(
    @Param('id') id: string,
    @Query('writing') writing,
    @Res() response: FastifyReply,
  ) {
    console.log(id);
    console.log(writing);
    try {
      const pdfPath = await this.generatePdfService.generatAmCoverSheet(
        +id,
        Number(writing) == 1,
      );
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + pdfPath.split('/').pop(),
      );

      const filePath = path.join(__dirname, '../../../..', pdfPath);

      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + pdfPath.split('/').pop(),
      );

      response.send(fs.createReadStream(filePath));
    } catch (error) {
      console.log(error);
      return error;
    }

    /*
    try {

      const result = await this.generatePdfService.generatAmCoverSheet(
        +id,
        Number(writing) == 1,
      );
      return response.status(201).send({ status: true, data: { url: result } });
    } catch (error) {


      return response.status(201).send({ status: false });
    }
    */
  }

  @Get('/br-cover/:id/')
  async generateBritishCOver(
    @Param('id') id: string,
    @Query('writing') writing,
    @Res() response: FastifyReply,
  ) {
    try {
      const result = await this.generatePdfService.generatBrCoverSheet(
        +id,
        Number(writing) == 1,
      );
      const filePath = path.join(__dirname, '../../../..', result);
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + result.split('/').pop(),
      );
      response.send(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(201).send({ status: false });
    }
  }

  @Get('/IBCover/:id/')
  async generateIBCOver(
    @Param('id') id: string,
    @Query('writing') writing,
    @Res() response: FastifyReply,
  ) {
    try {
      const result = await this.generatePdfService.generatIBCoverSheets(+id);
      const filePath = path.join(__dirname, '../../../..', result);
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + result.split('/').pop(),
      );
      response.send(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(201).send({ status: false });
    }
  }

  @ApiQuery({
    name: 'roomid',
    required: true,
    type: Number,
  })
  @Get('/attendance/')
  async generateAttendance(@Query('roomid') id, @Res() response: FastifyReply) {
    try {
      const result = await this.generatePdfService.generatAttendance(+id);
      const filePath = path.join(__dirname, '../../../..', result);
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + result.split('/').pop(),
      );
      response.send(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(201).send({ status: false });
    }
  }

  @Get('EnglishWriting/:id')
  async generateEnglishWriting(
    @Param('id') id: string,
    @Res() response: FastifyReply,
  ) {
    try {
      const result = await this.generatePdfService.generateEnglishWriting(+id);
      const filePath = path.join(__dirname, '../../../..', result);
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + result.split('/').pop(),
      );
      response.send(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(201).send({ status: false });
    }
  }
  @Get('EnglishSocialStudies/:id')
  async generateEnglishSocialStudies(
    @Param('id') id: string,
    @Res() response: FastifyReply,
  ) {
    try {
      const result = await this.generatePdfService.generateEnglishSocialStudies(
        +id,
      );
      const filePath = path.join(__dirname, '../../../..', result);
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + result.split('/').pop(),
      );
      response.send(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(201).send({ status: false });
    }
  }
  @Get('arabic/:id')
  async generatearabic(@Param('id') id: string, @Res() response: FastifyReply) {
    try {
      const result = await this.generatePdfService.generateArabicWriting(+id);
      const filePath = path.join(__dirname, '../../../..', result);
      response.header('Content-Type', 'application/pdf');
      response.header(
        'Content-Disposition',
        'attachment; filename=' + result.split('/').pop(),
      );
      response.send(fs.createReadStream(filePath));
    } catch (error) {
      return response.status(201).send({ status: false });
    }
  }
}
