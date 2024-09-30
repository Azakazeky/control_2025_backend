import { Storage } from '@google-cloud/storage';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { PrismaService } from 'src/Common/Db/prisma.service';
const fs = require('fs');
var storage = new Storage({
  projectId: 'nis-control-4cd9d',
  keyFilename: './nis-control-bucket.json',
});
const bucketName = 'nis-control-4cd9d.appspot.com';

@Injectable()
export class SystemLoggerService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSystemLogger() {
    var results = await this.prismaService.system_logger.findMany({});
    return results;
  }

  async getSystemLoggerUsersByIds(ids: string) {
    if (ids == '') {
      return [];
    } else if (ids.includes(',')) {
      const userIds = JSON.parse(ids).map((id) => +id);
      if (userIds.length == 0) {
        return [];
      }
      return await this.prismaService.users.findMany({
        where: {
          ID: {
            in: userIds,
          },
        },
        select: {
          ID: true,
          User_Name: true,
          Full_Name: true,
        },
      });
    }
  }
  async getSystemLoggerUserById(id: number) {
    return await this.prismaService.users.findFirst({
      where: {
        ID: id,
      },
      select: {
        User_Name: true,
        Full_Name: true,
      },
    });
  }

  async exportSystemLoggerToText() {
    var results = await this.prismaService.system_logger.findMany({});

    if (results.length == 0) {
      throw new HttpException('No logs found', HttpStatus.NOT_FOUND);
    } else {
      const fileName =
        new Date()
          .toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          })
          .replace(/:/g, '-')
          .replace(',', ' ') + '.txt';
      const logFilePath = path.join(__dirname, '../../../uploads/Logs/');
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(logFilePath)) {
        fs.mkdirSync(logFilePath, { recursive: true });
      }

      const logContent = results
        .map((log) => `${JSON.stringify(log)}`)
        .join('\n');
      fs.writeFile(logFilePath + fileName, logContent, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('File has been written successfully');
        }
      });

      await this.uploadSystemLoggerFile(`uploads/Logs/${fileName}`);

      return logFilePath + fileName;
    }
  }
  async resetAndExportSystemLoggerToText(userId: number) {
    var results = await this.prismaService.system_logger.findMany({});

    if (results.length == 0) {
      throw new HttpException('No logs found', HttpStatus.NOT_FOUND);
    } else {
      const fileName =
        new Date()
          .toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          })
          .replace(/:/g, '-')
          .replace(',', ' ') +
        ' cleared by user id ' +
        userId +
        '.txt';
      const logFilePath = path.join(__dirname, '../../../uploads/Logs/');
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(logFilePath)) {
        fs.mkdirSync(logFilePath, { recursive: true });
      }

      const logContent = results
        .map((log) => `${JSON.stringify(log)}`)
        .join('\n');
      fs.writeFile(logFilePath + fileName, logContent, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
        } else {
          console.log('File has been written successfully');
        }
      });

      await this.uploadSystemLoggerFile(`uploads/Logs/${fileName}`);

      await this.prismaService.system_logger.deleteMany({});

      return logFilePath + fileName;
    }
  }
  async exportSystemLoggerToExcel() {
    var results = await this.prismaService.system_logger.findMany({});

    if (results.length == 0) {
      throw new HttpException('No logs found', HttpStatus.NOT_FOUND);
    } else {
      const fileName =
        new Date()
          .toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short',
          })
          .replace(/:/g, '-')
          .replace(',', '') + '.xlsx';
      const logFilePath = path.join(__dirname, '../../../uploads/Logs/');
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(logFilePath)) {
        fs.mkdirSync(logFilePath, { recursive: true });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Logs');
      worksheet.columns = [
        { header: 'ID', key: 'ID', width: 10 },
        { header: 'Created At', key: 'Created_At', width: 20 },
        { header: 'Body', key: 'Body', width: 20 },
        { header: 'Method', key: 'Method', width: 20 },
        { header: 'Platform', key: 'Platform', width: 20 },
        { header: 'URL', key: 'URL', width: 20 },
        { header: 'User Agent', key: 'User_Agent', width: 10 },
        { header: 'User ID', key: 'User_ID', width: 10 },
        { header: 'IP', key: 'IP', width: 10 },
      ];

      results.forEach((log) => {
        worksheet.addRow({
          ID: log.ID,
          Created_At: log.Created_At,
          Body: log.body,
          Method: log.method,
          Platform: log.platform,
          URL: log.url,
          User_Agent: log.userAgent,
          User_ID: log.userId,
          IP: log.ip,
        });
      });

      await workbook.xlsx.writeFile(logFilePath + fileName);

      await this.uploadSystemLoggerFile(`uploads/Logs/${fileName}`);

      return logFilePath + fileName;
    }
  }

  async uploadSystemLoggerFile(path: string) {
    let genrated = await storage.bucket(bucketName).upload(path, {
      destination: path,
    });
    const bucket = genrated[0].metadata.bucket;
    const name = genrated[0].metadata.name;
    const showedPdf = `https://storage.googleapis.com/${bucket}/${name}`;
    const download = genrated[0].metadata.mediaLink;
    return {
      fileLocation: showedPdf,
      downloadUrl: download,
      name: name,
    };
  }
}
