import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  /**
   * Returns the current time plus 2 hours in the ISO format: "2022-07-25T14:30:00.000Z"
   * @returns {String} The current time plus 2 hours in ISO format
   */
  getServerTime() {
    return this.appService.addHours();
  }

  // @Get('*') // Catch all route to handle nested folders
  // async getFile(@Param() params: string, @Res() res: FastifyReply) {
  //   params = JSON.stringify(params).replaceAll(/[{}*:"]/g, '');
  //   // Extract the full path from the URL
  //   const filePath = join(__dirname, '..', params);

  //   try {
  //     if (fs.existsSync(filePath)) {
  //       res.header('Content-Type', 'application/pdf');
  //       res.header(
  //         'Content-Disposition',
  //         'attachment; filename="document.pdf"',
  //       );
  //       return res.send(filePath);
  //     } else {
  //       throw new NotFoundException('File not found');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // Check if the file exists and send it if found
  // }
}
