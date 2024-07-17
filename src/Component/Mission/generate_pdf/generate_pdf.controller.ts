import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, UseGuards } from '@nestjs/common';
import { GeneratePdfService } from './generate_pdf.service'; import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
// @UseGuards(JwtAuthGuard)

@UseGuards(PrismaExceptionFilter)
@ApiTags("Generate-PDF")
@Controller('generate-pdf')
export class GeneratePdfController {
  constructor(private readonly generatePdfService: GeneratePdfService) { }

  @ApiQuery({
    name: 'gradeid',
    required: false,
    type: Number,
  })
  @Get('/seats/:id?')
  // @Header('Content-Disposition', 'attachment; filename="seats.pdf"')
  async generateseats(@Param('id') id: string, @Query('gradeid') gradeId, @Res() response: Response) {
    console.log('mission id' + id);
    console.log('grade id : ' + gradeId);
    try {
      const fileName = 'pdfGenerateor/seats/seats' + gradeId + id + '.pdf';
      const result = await this.generatePdfService.checkFile(fileName);

      // return response.status(201).send({ url: result });

      return ({ url: result });
    } catch (error) {
      console.log('start generate');
      var result = await this.generatePdfService.generatSeatNumber(+id, +gradeId);

      return ({ url: result });
    }
  }


  @Get('/am-cover/:id/')
  // @Header('Content-Disposition', 'attachment; filename="Amircan Covers.pdf"')
  async generateAmircanCovers(@Param('id') id: string, @Query('writing') writing, @Res() response: Response) {
    console.log(id);
    console.log(writing);
    try {
      var fileName = 'pdfGenerateor/AmCover/AmCovers' + id;
      if (Number(writing) == 1) {
        fileName = fileName + 'writing'
      }
      fileName = fileName + '.pdf';
      const result = await this.generatePdfService.checkFile(fileName);
      return ({ url: result });
    } catch (error) {
      const result = await this.generatePdfService.generatAmCoverSheet(+id, Number(writing) == 1);
      console.log('result ' + result);

      return ({ url: result });
    }
  }

  @Get('/br-cover/:id/')
  // @Header('Content-Disposition', 'attachment; filename="Amircan Covers.pdf"')
  async generateBritishCOver(@Param('id') id: string, @Query('writing') writing, @Res() response: Response) {
    try {
      var path = 'pdfGenerateor/BrCover/BrCover' + id;
      if (Number(writing) == 1) {
        path = path + 'writing'
      }
      path = path + '.pdf';
      const result = await this.generatePdfService.checkFile(path);


      return ({ url: result });
    } catch (error) {
      console.log(error);
      const result = await this.generatePdfService.generatBrCoverSheet(+id, Number(writing) == 1);
      // console.log(result);
      // const fileee = await this.pdfService.fileBuffer(result);
      return ({ url: result });
    }
  }

  @Get('/IBCover/:id/')
  // @Header('Content-Disposition', 'attachment; filename="Amircan Covers.pdf"')
  async generateIBCOver(@Param('id') id: string, @Query('writing') writing, @Res() response: Response) {


    try {
      var path = 'pdfGenerateor/IBCover/IBCover' + id;
      if (Number(writing) == 1) {
        path = path + 'writing'
      }
      path = path + '.pdf';
      const result = await this.generatePdfService.checkFile(path);

      return ({ url: result });
    } catch (error) {
      console.log(error);
      const result = await this.generatePdfService.generatIBCoverSheets(+id);
      return ({ url: result });
    }
  }

  @ApiQuery({
    name: 'roomid',
    required: true,
    type: Number,
  })
  @Get('/attendance/')
  // @Header('Content-Disposition', 'attachment; filename="attendance.pdf"')
  async generateAttendance(@Query('roomid') id, @Res() response: Response) {
    try {
      var path = 'pdfGenerateor/attendance/RoomId' + id + '.pdf';
      const result = await this.generatePdfService.checkFile(path);


      return ({ url: result });
    } catch (error) {
      console.log(error);
      const result = await this.generatePdfService.generatAttendance(+id, path);
      return ({ url: result });
    }
  }


  @Get('EnglishWriting/:id')
  async generateEnglishWriting(@Param('id') id: string, @Res() response: Response) {
    try {
      var path: string = 'pdfGenerateor/Writing/English/English_Writing_Assessment_';
      const fileName = path + id + '.pdf'
      const result = await this.generatePdfService.checkFile(fileName);

      return ({ url: result });
    } catch (error) {
      console.log(error);
      const result = await this.generatePdfService.generateEnglishWriting(+id);
      console.log(result);

      return ({ url: result });
    }

  }
  @Get('EnglishSocialStudies/:id')
  async generateEnglishSocialStudies(@Param('id') id: string, @Res() response: Response) {
    try {
      var path: string = 'pdfGenerateor/Writing/EnglishSocialStudies/EnglishSocialStudies_';
      const fileName = path + id + '.pdf'
      const result = await this.generatePdfService.checkFile(fileName);

      return ({ url: result });
    } catch (error) {
      console.log(error);
      const result = await this.generatePdfService.generateEnglishSocialStudies(+id);
      console.log(result);
      return ({ url: result });
    }
  }
  @Get('arabic/:id')
  async generatearabic(@Param('id') id: string, @Res() response: Response) {

    try {
      var path: string = 'pdfGenerateor/Writing/Arabic/Arabic_';
      const fileName = path + id + '.pdf'
      const result = await this.generatePdfService.checkFile(fileName);
      return ({ url: result });
    } catch (error) {
      console.log(error);
      const result = await this.generatePdfService.generateArabicWriting(+id);
      console.log(result);
      return ({ url: result });

    }
  }
}
