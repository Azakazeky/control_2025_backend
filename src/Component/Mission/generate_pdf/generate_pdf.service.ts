import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'node:path';
import { delay } from 'rxjs';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { ComponantServices } from './pdfComponant.services';
const PDFDocument = require('pdfkit');
const fs = require('fs');
const blobStream = require('blob-stream');

@Injectable()
export class GeneratePdfService {
  constructor(
    private readonly ComponantServices: ComponantServices,
    private readonly prismaService: PrismaService,
  ) {}

  // store = new Storage({
  //   projectId: 'nis-control-4cd9d',
  //   keyFilename: './nis-control-bucket.json',
  // });

  // async checkFile(filepath: string) {
  // var existfile = await fs.existsSync(filepath);
  // if (!existfile) {
  //   console.log('file not found');
  //   throw new NotFoundException('file not found');
  // }
  // let generatedUrl = await this.saveDocToGoogle(filepath);
  // return generatedUrl;
  // }

  // async saveDocToGoogle(path) {
  // let bucket = this.store.bucket('nis-control-4cd9d.appspot.com');
  // console.log('save pdf file to google');
  // let generated = await bucket.upload(path, {
  //   destination: path,
  //   predefinedAcl: 'publicRead',
  // });
  // return generated[0].metadata.mediaLink;

  // }

  async fileBuffer(filepath: string) {
    var existfile = await fs.existsSync(filepath);
    if (!existfile) {
      console.log('file not found');
      await delay(100000);
    }
    let doc = await readFileSync(join(process.cwd(), filepath));
    console.log('file buffer method');
    return doc;
  }

  async getBuffer(pdf, path) {
    await this.ensureDirectoryExistenceOrCreate(path);
    return new Promise((resolve, reject) => {
      pdf.pipe(fs.createWriteStream(path));
      pdf.on('end', () => {
        resolve(pdf);
        // let pdfData =;
      });
    });
  }

  async generatAmCoverSheet(id: number, writing: boolean) {
    var path: string = 'pdfGenerateor/AmCover/AmCovers';
    try {
      // get Exam Mission data
      var exammission = await this.prismaService.exam_mission.findFirst({
        where: {
          ID: id,
          control_mission: {
            Active: 1,
          },
        },
        select: {
          pdf_V2: true,
          pdf: true,
          duration: true,
          Month: true,
          Year: true,

          control_mission: {
            select: {
              Name: true,
            },
          },
          subjects: {
            select: {
              Name: true,
            },
          },
        },
      });
      // get Students Barcode Data
      var dbResult = await this.prismaService.student_barcode.findMany({
        where: {
          Exam_Mission_ID: id,
          student_seat_numnbers: {
            Active: 1,
            control_mission: {
              Active: 1,
            },
          },
        },

        select: {
          Barcode: true,
          Exam_Version: true,
          student_seat_numnbers: {
            select: {
              Seat_Number: true,
            },
          },
          exam_mission: {
            select: {
              subjects: {
                select: {
                  Name: true,
                },
              },
            },
          },
          student: {
            select: {
              First_Name: true,
              Second_Name: true,
              Third_Name: true,
              school_class: {
                select: {
                  Name: true,
                },
              },

              grades: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
        orderBy: {
          student_seat_numnbers: {
            Seat_Number: 'asc',
          },
        },
      });

      var doc = new PDFDocument({
        format: 'A4',
        margin: 20,
      });

      for (const stdBarcode of dbResult) {
        var name: String =
          stdBarcode.student.First_Name +
          ' ' +
          stdBarcode.student.Second_Name +
          ' ' +
          stdBarcode.student.Third_Name;
        this.ComponantServices.generateHeaderAm(doc); // Invoke `generateHeader` function.
        this.ComponantServices.generateBody(
          doc,
          stdBarcode.student.grades.Name,
          stdBarcode.exam_mission.subjects.Name,
          exammission.duration + '',
          exammission.Month.split(' ')[1] + ' ' + exammission.Year,
          writing,
        );
        this.ComponantServices.generateTableAm(doc, 10);

        // var writing = CreatePdfDto.Writing == 1 ? true : false;

        var examVersion =
          exammission.pdf_V2 != null ? stdBarcode.Exam_Version : undefined;
        await this.ComponantServices.generateFooterAm(
          doc,
          name,
          // student class must be create relastions
          stdBarcode.student.school_class.Name + '',
          exammission.Month + ' ' + exammission.Year,
          stdBarcode.student_seat_numnbers.Seat_Number,
          stdBarcode.Barcode,
          writing,
          examVersion,
        );
        if (doc.bufferedPageRange().start != dbResult.length - 1) doc.addPage();
      }
      path = path + id;

      if (writing) {
        path = path + 'writing';
      }
      path = path + '.pdf';
      console.log(writing);
      console.log(path);
      doc.end();

      // console.log('save pdf file to storage');
      await this.getBuffer(doc, path);
      // let generatedurl = await this.saveDocToGoogle(path);
      // return Promise.resolve(generatedurl);
      return Promise.resolve(path);
    } catch (error) {
      console.log(error);
      return 'error';
    }
  }

  async generatIBCoverSheets(id: number) {
    var path: string = 'pdfGenerateor/IBCover/IBCover';
    try {
      // get Exam Mission data
      var exammission = await this.prismaService.exam_mission.findFirst({
        where: {
          ID: id,
          control_mission: {
            Active: 1,
          },
        },
        select: {
          pdf_V2: true,
          duration: true,
          Month: true,
          Year: true,
          control_mission: {
            select: {
              Name: true,
            },
          },
          subjects: {
            select: {
              Name: true,
            },
          },
        },
      });
      // get Students Barcode Data
      var dbResult = await this.prismaService.student_barcode.findMany({
        where: {
          Exam_Mission_ID: id,
          student_seat_numnbers: {
            Active: 1,
            control_mission: {
              Active: 1,
            },
          },
        },
        orderBy: {
          student_seat_numnbers: {
            Seat_Number: 'asc',
          },
        },

        select: {
          Barcode: true,
          Exam_Version: true,
          student_seat_numnbers: {
            select: {
              Seat_Number: true,
            },
          },
          exam_mission: {
            select: {
              subjects: {
                select: {
                  Name: true,
                },
              },
            },
          },
          student: {
            select: {
              First_Name: true,
              Second_Name: true,
              Third_Name: true,
              school_class: {
                select: {
                  Name: true,
                },
              },
              grades: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });
      var doc = new PDFDocument({
        format: 'A4',
        margin: 20,
      });
      for (const stdBarcode of dbResult) {
        // for loop here doc.addPage();
        var name: String =
          stdBarcode.student.First_Name +
          ' ' +
          stdBarcode.student.Second_Name +
          ' ' +
          stdBarcode.student.Third_Name;
        this.ComponantServices.generateHeaderIB(doc); // Invoke `generateHeader` function.
        this.ComponantServices.generateBody(
          doc,
          stdBarcode.student.grades.Name,
          stdBarcode.exam_mission.subjects.Name,
          exammission.duration + '',
          exammission.Month.split(' ')[1] + ' ' + exammission.Year,
          false,
        );
        this.ComponantServices.generateTableAm(doc, 10);
        // var writing = CreatePdfDto.Writing == 1 ? true : false;
        var examVersion =
          exammission.pdf_V2 != null ? stdBarcode.Exam_Version : undefined;

        await this.ComponantServices.generateFooterBr(
          doc,
          name,
          // student class must be create relastions
          stdBarcode.student.school_class.Name + '',
          exammission.Month + ' ' + exammission.Year,
          stdBarcode.student_seat_numnbers.Seat_Number,
          stdBarcode.Barcode,
          false,
          examVersion,
        );
        if (doc.bufferedPageRange().start != dbResult.length - 1) doc.addPage();
      }

      console.log(dbResult.length);
      path = path + id;

      path = path + '.pdf';
      doc.end();

      // await this.ensureDirectoryExistenceOrCreate(path);
      // await doc.pipe(fs.createWriteStream(path));
      await this.getBuffer(doc, path);
      // let generatedUrl = await this.saveDocToGoogle(path);
      // console.log('save pdf file to storage');
      // return generatedUrl;
      return path;
    } catch (error) {
      return 'error';
    }
  }

  async generatBrCoverSheet(id: number, writing: boolean) {
    var path: string = 'pdfGenerateor/BrCover/BrCover';
    try {
      // get Exam Mission data
      var exammission = await this.prismaService.exam_mission.findFirst({
        where: {
          ID: id,
          control_mission: {
            Active: 1,
          },
        },
        select: {
          pdf_V2: true,
          duration: true,
          Month: true,
          Year: true,
          control_mission: {
            select: {
              Name: true,
            },
          },
          subjects: {
            select: {
              Name: true,
            },
          },
        },
      });
      // get Students Barcode Data
      var dbResult = await this.prismaService.student_barcode.findMany({
        where: {
          Exam_Mission_ID: id,
          student_seat_numnbers: {
            Active: 1,
            control_mission: {
              Active: 1,
            },
          },
        },
        orderBy: {
          student_seat_numnbers: {
            Seat_Number: 'asc',
          },
        },

        select: {
          Barcode: true,
          Exam_Version: true,
          student_seat_numnbers: {
            select: {
              Seat_Number: true,
            },
          },
          exam_mission: {
            select: {
              subjects: {
                select: {
                  Name: true,
                },
              },
            },
          },
          student: {
            select: {
              First_Name: true,
              Second_Name: true,
              Third_Name: true,
              school_class: {
                select: {
                  Name: true,
                },
              },
              grades: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
      });
      var doc = new PDFDocument({
        format: 'A4',
        margin: 20,
      });
      for (const stdBarcode of dbResult) {
        // for loop here doc.addPage();
        var name: String =
          stdBarcode.student.First_Name +
          ' ' +
          stdBarcode.student.Second_Name +
          ' ' +
          stdBarcode.student.Third_Name;
        this.ComponantServices.generateHeaderBr(doc); // Invoke `generateHeader` function.
        this.ComponantServices.generateBody(
          doc,
          stdBarcode.student.grades.Name,
          stdBarcode.exam_mission.subjects.Name,
          exammission.duration + '',
          exammission.Month.split(' ')[1] + ' ' + exammission.Year,
          writing,
        );
        this.ComponantServices.generateTableBr(doc, 20);
        // var writing = CreatePdfDto.Writing == 1 ? true : false;

        var examVersion =
          exammission.pdf_V2 != null ? stdBarcode.Exam_Version : undefined;
        await this.ComponantServices.generateFooterBr(
          doc,
          name,
          // student class must be create relastions
          stdBarcode.student.school_class.Name + '',
          exammission.Month + ' ' + exammission.Year,
          stdBarcode.student_seat_numnbers.Seat_Number,
          stdBarcode.Barcode,
          writing,
          examVersion,
        );
        if (doc.bufferedPageRange().start != dbResult.length - 1) doc.addPage();
      }

      // console.log(dbResult.length);
      path = path + id;
      if (writing) {
        path = path + 'writing';
      }
      path = path + '.pdf';
      // console.log(writing);
      console.log('path', path);
      doc.end();

      // await this.ensureDirectoryExistenceOrCreate(path);
      // await doc.pipe(fs.createWriteStream(path));
      await this.getBuffer(doc, path);
      // let generatedUrl = await this.saveDocToGoogle(path);
      // console.log('save pdf file to storage');
      // return generatedUrl;
      return path;
    } catch (error) {
      return 'error';
    }
  }

  async generatSeatNumber(id: number, gradeId: number) {
    var path: string = 'pdfGenerateor/seats/seats' + gradeId + id + '.pdf';

    try {
      var dbResult = await this.prismaService.student_seat_numnbers.findMany({
        where: {
          Control_Mission_ID: id,
          Active: 1,
          AND: {
            Grades_ID: gradeId,
          },
        },
        select: {
          Seat_Number: true,
          student: {
            select: {
              First_Name: true,
              Second_Name: true,
              Third_Name: true,
              Second_Lang: true,
              Religion: true,
            },
          },
          exam_room: {
            select: {
              Name: true,
            },
          },
          grades: {
            select: {
              Name: true,
            },
          },
        },
        orderBy: {
          Seat_Number: 'asc',
        },
      });
      var doc = new PDFDocument({
        margin: 10,
      });

      for (const seat of dbResult) {
        this.ComponantServices.generateSeatNumber(
          doc,
          seat.student.First_Name + ' ' + seat.student.Second_Name,
          seat.student.Third_Name,
          seat.exam_room.Name,
          seat.Seat_Number,
          seat.grades.Name,
          seat.student.Religion,
          seat.student.Second_Lang,
        );
      }
      // Create a reference to a file object
      doc.end();
      await this.ensureDirectoryExistenceOrCreate(path);

      // doc.pipe(fs.createWriteStream(path));

      // Create a pass through stream from a string

      // let generated =await bucket.upload(path, {
      //   destination: path ,
      //   metadata: {
      //     cacheControl: 'public, max-age=31536000'
      // },
      // predefinedAcl: 'publicRead'
      //   });
      await this.getBuffer(doc, path);
      // let generatedUrl = await this.saveDocToGoogle(path);
      // return generatedUrl;
      console.log('path', path);
      return path;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async generatAttendance(RoomId: number) {
    var path = 'pdfGenerateor/attendance/RoomId' + RoomId + '.pdf';

    try {
      var StudentsInRoom = await this.prismaService.exam_room.findUnique({
        where: {
          ID: RoomId,
          control_mission: {
            Active: 1,
          },
        },
        select: {
          Name: true,
          Stage: true,
          student_seat_numnbers: {
            where: {
              Active: 1,
            },
            select: {
              Seat_Number: true,
              student: {
                select: {
                  First_Name: true,
                  Second_Name: true,
                  Third_Name: true,
                  Religion: true,
                  Second_Lang: true,
                  school_class: {
                    select: {
                      Name: true,
                    },
                  },
                  grades: {
                    select: {
                      Name: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              Seat_Number: 'asc',
            },
          },
        },
      });

      var FrenshLength = 0;
      var GermanLength = 0;
      var chrestienLength = 0;

      var z = StudentsInRoom.student_seat_numnbers.length;

      var doc = new PDFDocument({
        margin: 20,
      });

      let y = 50;
      let x = 10;
      /// we need to add field room type (Elementary / high / middle) school

      doc
        .image('assetss/nis_logo.png', 50, 10, { width: 40 })
        .font('Times-Bold')
        .fontSize(16);
      doc
        .text(StudentsInRoom.Stage + ' School', { align: 'center' })
        .text(StudentsInRoom.Name, { align: 'center' });
      y = y + 20;
      doc
        .lineWidth(7.5)
        .fillAndStroke('#cccccc')
        .lineJoin('miter')
        .rect(x + 4, y + 4, 382, 7.5)
        .stroke();
      doc
        .lineWidth(1)
        .fillAndStroke('#000000')
        .font('Times-Bold')
        .fontSize(12)
        .text('Grade', x + 5, y + 3)
        .text('Student', x + 170, y + 3)
        .text('Seating No.', x + 320, y + 3)
        .text('Notes', x + 450, y + 3)
        .text('Class', x + 550, y + 3)

        .moveTo(x, y)
        .lineTo(x + 590, y)
        .stroke()
        .fontSize(9)
        .font('Times-Roman');

      for (const seat of StudentsInRoom.student_seat_numnbers) {
        y = y + 15;
        console.log(seat.student.Religion);

        if (seat.student.Religion.includes('Chr')) {
          chrestienLength++;
        }
        if (seat.student.Second_Lang) {
          if (seat.student.Second_Lang.toLowerCase().includes('fre')) {
            FrenshLength++;
          } else if (seat.student.Second_Lang.toLowerCase().includes('ger')) {
            GermanLength++;
          }
        }

        doc
          .text(seat.student.grades.Name, 15, y + 5)
          .text(
            seat.student.First_Name +
              ' ' +
              seat.student.Second_Name +
              ' ' +
              seat.student.Third_Name,
            85,
            y + 5,
          )
          .text(seat.Seat_Number, 335, y + 5);

        if (seat.student.Second_Lang) {
          doc.text(seat.student.Second_Lang[0].toUpperCase(), 520, y + 5);
        }

        doc
          .text(seat.student.school_class.Name, 570, y + 5)
          .moveTo(x, y)
          .lineTo(x + 590, y)
          .stroke();
      }
      console.log(GermanLength);
      console.log(FrenshLength);
      console.log(chrestienLength);

      doc
        .moveTo(x, y + 15)
        .lineTo(x + 590, y + 15)
        .stroke();
      z = z + 2;
      y = 50;
      x = 10;

      doc
        .moveTo(x, y + 20)
        .lineTo(x, z * 15 + y + 5)
        .stroke();
      doc
        .moveTo(80, y + 20)
        .lineTo(80, z * 15 + y + 5)
        .stroke();
      doc
        .moveTo(310, y + 20)
        .lineTo(310, z * 15 + y + 5)
        .stroke();
      doc
        .moveTo(400, y + 20)
        .lineTo(400, z * 15 + y + 5)
        .stroke();
      doc
        .moveTo(450, y + 35)
        .lineTo(450, z * 15 + y + 5)
        .stroke();
      doc
        .moveTo(500, y + 35)
        .lineTo(500, z * 15 + y + 5)
        .stroke();
      doc
        .moveTo(550, y + 20)
        .lineTo(550, z * 15 + y + 5)
        .stroke();
      doc
        .moveTo(600, y + 20)
        .lineTo(600, z * 15 + y + 5)
        .stroke();

      doc
        .font('Times-Bold')
        .fontSize(10)
        .text(
          'Students Count : ' + StudentsInRoom.student_seat_numnbers.length,
          x,
          z * 15 + y + 20,
        )
        .text('French', x + 450, z * 15 + y + 20)
        .text('German', x + 500, z * 15 + y + 20);

      doc
        .font('Times-Bold')
        .fontSize(10)
        .text(
          'Christian Students Count : ' + chrestienLength,
          x,
          z * 15 + y + 40,
        )
        .text('Second Language Students Count :', x + 250, z * 15 + y + 40)
        .text(FrenshLength, x + 460, z * 15 + y + 40)
        .text(GermanLength, x + 510, z * 15 + y + 40);

      doc.end();
      // await this.ensureDirectoryExistenceOrCreate(path);

      // doc.pipe(fs.createWriteStream(path));
      await this.getBuffer(doc, path);
      // let generatedUrl = await this.saveDocToGoogle(path);
      // console.log('save pdf file to storage');

      // return generatedUrl;
      return path;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  removeLastSegment(input: String): string {
    if (!input) return '';

    // Determine the type of slash used
    const hasBackslash = input.includes('\\');
    const hasForwardSlash = input.includes('/');

    if (hasBackslash && hasForwardSlash) {
      throw new Error(
        'Input path contains both backslashes and forward slashes.',
      );
    }

    const slash = hasBackslash ? '\\' : '/';

    // Check if the input ends with a slash and remove it if necessary
    if (input.endsWith(slash)) {
      input = input.slice(0, -1);
    }

    // Split the string by the identified slash
    const segments = input.split(slash);

    // Remove the last segment
    segments.pop();

    // Rejoin the remaining segments with the identified slash
    const result = segments.join(slash);

    // Add the trailing slash back if the original string had it
    if (input.endsWith(slash)) {
      return result + slash;
    }

    return result;
  }
  async ensureDirectoryExistenceOrCreate(dirPath: String): Promise<void> {
    try {
      dirPath = this.removeLastSegment(dirPath);
      // Check if directory exists
      await fs.promises.access(dirPath);
    } catch (error) {
      // Directory does not exist, so create it
      await fs.promises.mkdir(dirPath, { recursive: true });
    }
  }
  async generateEnglishWriting(missionId: number) {
    var path: string =
      'pdfGenerateor/Writing/English/English_Writing_Assessment_';
    try {
      // get Exam Mission data
      var exammission = await this.prismaService.exam_mission.findFirst({
        where: {
          ID: missionId,
          control_mission: {
            Active: 1,
          },
        },
        select: {
          duration: true,
          Month: true,
          Year: true,
          control_mission: {
            select: {
              Name: true,
            },
          },
          subjects: {
            select: {
              Name: true,
            },
          },
        },
      });
      // get Students Barcode Data
      var dbResult = await this.prismaService.student_barcode.findMany({
        where: {
          Exam_Mission_ID: missionId,
          student_seat_numnbers: {
            Active: 1,
            control_mission: {
              Active: 1,
            },
          },
        },

        select: {
          Barcode: true,
          Exam_Version: true,
          student_seat_numnbers: {
            select: {
              Seat_Number: true,
            },
          },
          exam_mission: {
            select: {
              subjects: {
                select: {
                  Name: true,
                },
              },
            },
          },
          student: {
            select: {
              First_Name: true,
              Second_Name: true,
              Third_Name: true,
              school_class: {
                select: {
                  Name: true,
                },
              },

              grades: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
        orderBy: {
          student_seat_numnbers: {
            Seat_Number: 'asc',
          },
        },
      });

      var doc = new PDFDocument({
        format: 'A4',
        margin: 20,
      });
      for (const stdBarcode of dbResult) {
        // if (stdBarcode.Barcode == "21648383636388") {
        //   console.log('this bad');
        // }
        var name: String =
          stdBarcode.student.First_Name +
          ' ' +
          stdBarcode.student.Second_Name +
          ' ' +
          stdBarcode.student.Third_Name;
        this.ComponantServices.generateEnglishWritingHeader(
          doc,
          stdBarcode.student.grades.Name,
          stdBarcode.Exam_Version,
        );
        this.ComponantServices.generateEnglishWritingBody(doc);
        await this.ComponantServices.generataEnglishWritingFooter(
          doc,
          stdBarcode.student.school_class.Name,
          exammission.Month,
          stdBarcode.Exam_Version,
          name,
          stdBarcode.Barcode,
        );
        // if (doc.bufferedPageRange().start != dbResult.length - 1)
        doc.addPage();
        doc
          .image('assetss/waexam/AMWAPAGE2.png', 0, 0, {
            width: 640,
            height: 1000,
            fit: [640, 1000],
            align: 'center',
          })
          .addPage();
      }

      doc.end();
      path = path + missionId + '.pdf';
      console.log(path);
      await this.getBuffer(doc, path);
      // return await this.fileBuffer(path);
      // let generatedurl = await this.saveDocToGoogle(path);
      // return Promise.resolve(generatedurl);
      return Promise.resolve(path);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async generateEnglishSocialStudies(missionId: number) {
    var path: string =
      'pdfGenerateor/Writing/EnglishSocialStudies/EnglishSocialStudies_';
    try {
      // get Exam Mission data
      var exammission = await this.prismaService.exam_mission.findFirst({
        where: {
          ID: missionId,
          control_mission: {
            Active: 1,
          },
        },
        select: {
          duration: true,
          Month: true,
          Year: true,
          control_mission: {
            select: {
              Name: true,
            },
          },
          subjects: {
            select: {
              Name: true,
            },
          },
        },
      });
      // get Students Barcode Data
      var dbResult = await this.prismaService.student_barcode.findMany({
        where: {
          Exam_Mission_ID: missionId,
          student_seat_numnbers: {
            Active: 1,
          },
        },

        select: {
          Barcode: true,
          Exam_Version: true,
          student_seat_numnbers: {
            select: {
              Seat_Number: true,
            },
          },
          exam_mission: {
            select: {
              subjects: {
                select: {
                  Name: true,
                },
              },
            },
          },
          student: {
            select: {
              First_Name: true,
              Second_Name: true,
              Third_Name: true,
              school_class: {
                select: {
                  Name: true,
                },
              },

              grades: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
        orderBy: {
          student_seat_numnbers: {
            Seat_Number: 'asc',
          },
        },
      });

      var doc = new PDFDocument({
        format: 'A4',
        margin: 20,
      });
      for (const stdBarcode of dbResult) {
        var name: String =
          stdBarcode.student.First_Name +
          ' ' +
          stdBarcode.student.Second_Name +
          ' ' +
          stdBarcode.student.Third_Name;
        this.ComponantServices.generateEnglishSocialStudiesHeader(
          doc,
          stdBarcode.student.grades.Name,
          stdBarcode.Exam_Version,
          stdBarcode.Barcode,
        );
        this.ComponantServices.generateEnglishSocialStudiesBody(doc);
        await this.ComponantServices.generataEnglishWritingFooter(
          doc,
          stdBarcode.student.school_class.Name,
          exammission.Month,
          stdBarcode.Exam_Version,
          name,
          stdBarcode.Barcode,
        );
        // if (doc.bufferedPageRange().start != dbResult.length - 1)
        doc.addPage();
        doc
          .image('assetss/waexam/ENSSWAPAGE2.png', 0, 0, {
            width: 610,
            height: 1000,
            fit: [610, 1000],
            align: 'center',
          })
          .addPage();
      }

      doc.end();
      path = path + missionId + '.pdf';
      console.log(path);
      await this.getBuffer(doc, path);
      // return await this.fileBuffer(path);
      // let generatedurl = await this.saveDocToGoogle(path);
      // return Promise.resolve(generatedurl);
      return Promise.resolve(path);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async generateArabicWriting(missionId: number) {
    var path: string = 'pdfGenerateor/Writing/Arabic/Arabic_';
    try {
      // get Exam Mission data
      var exammission = await this.prismaService.exam_mission.findFirst({
        where: {
          ID: missionId,
          control_mission: {
            Active: 1,
          },
        },
        select: {
          duration: true,
          Month: true,
          Year: true,
          control_mission: {
            select: {
              Name: true,
            },
          },
          subjects: {
            select: {
              Name: true,
            },
          },
        },
      });
      // get Students Barcode Data
      var dbResult = await this.prismaService.student_barcode.findMany({
        where: {
          Exam_Mission_ID: missionId,
          student_seat_numnbers: {
            Active: 1,
          },
        },

        select: {
          Barcode: true,
          Exam_Version: true,
          student_seat_numnbers: {
            select: {
              Seat_Number: true,
            },
          },
          exam_mission: {
            select: {
              subjects: {
                select: {
                  Name: true,
                },
              },
            },
          },
          student: {
            select: {
              First_Name: true,
              Second_Name: true,
              Third_Name: true,
              school_class: {
                select: {
                  Name: true,
                },
              },

              grades: {
                select: {
                  Name: true,
                },
              },
            },
          },
        },
        orderBy: {
          student_seat_numnbers: {
            Seat_Number: 'asc',
          },
        },
      });

      var doc = new PDFDocument({
        format: 'A4',
        margin: 20,
      });

      for (const stdBarcode of dbResult) {
        var name: String =
          stdBarcode.student.First_Name +
          ' ' +
          stdBarcode.student.Second_Name +
          ' ' +
          stdBarcode.student.Third_Name;
        // doc.rtl(true);
        this.ComponantServices.generateArabicWritingHeader(
          doc,
          stdBarcode.student.grades.Name,
          stdBarcode.Exam_Version,
          stdBarcode.Barcode,
        );
        this.ComponantServices.generateArabicWritingBody(doc);
        await this.ComponantServices.generataArabicWritingFooter(
          doc,
          stdBarcode.student.school_class.Name,
          exammission.Month,
          stdBarcode.Exam_Version,
          name,
          stdBarcode.Barcode,
        );
        // if (doc.bufferedPageRange().start != dbResult.length - 1)
        doc.addPage();
        doc
          .image('assetss/waexam/ARWAPAGE2.jpg', 0, 0, {
            width: 610,
            height: 1000,
            fit: [610, 1000],
            align: 'center',
          })
          .addPage();
      }

      doc.end();
      path = path + missionId + '.pdf';
      console.log(path);
      await this.getBuffer(doc, path);
      // return await this.fileBuffer(path);
      // let generatedurl = await this.saveDocToGoogle(path)
      return Promise.resolve(path);
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
