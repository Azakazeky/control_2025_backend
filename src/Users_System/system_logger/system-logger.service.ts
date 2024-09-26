import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';

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

  async uploadSystemLoggerFile(path: string) {
    let genrated = await storage.bucket(bucketName).upload(path, {
      destination: path,
      predefinedAcl: 'publicRead',
      contentType: '',
      metadata: {
        contentType: 'application/pdf',
        contentDisposition: 'inline',
      },
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
