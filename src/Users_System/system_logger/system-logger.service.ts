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

  /**
   * Returns the system logger.
   *
   * @returns {Promise<SystemLogger[]>}
   */
  async getSystemLogger() {
    var results = await this.prismaService.system_logger.findMany({});
    return results;
  }

  /**
   * Returns a list of users based on the user-ids query parameter.
   *
   * @param ids a comma-separated list of user-ids
   *
   * @returns {Promise<User[]>}
   */

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
  /**
   * Returns a user based on the user-id query parameter.
   *
   * @param id The user-id of the user to find.
   *
   * @returns {Promise<User>}
   */
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

  /**
   * Exports the system logger to a text file.
   *
   * @returns {Promise<string>} the path to the exported text file
   */
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
  /**
   * Resets the system logger and exports it to a text file.
   * @param userId the ID of the user who cleared the system logger
   * @returns the path to the text file containing the system logger
   */
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
  /**
   * Exports the system logger to an excel file.
   *
   * @returns {Promise<string>} the path to the exported excel file
   * @throws {HttpException} if no logs are found
   */
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

  /**
   * Uploads a system logger file to the Google Cloud Storage bucket and returns the uploaded file location, download url, and file name.
   * @param path the path of the file to be uploaded
   * @returns an object containing the file location, download url, and file name
   */
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
