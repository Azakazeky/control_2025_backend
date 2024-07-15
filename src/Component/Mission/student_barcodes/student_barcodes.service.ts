import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateStudentBarcodeDto } from './dto/create-student_barcode.dto';
import { UpdateStudentBarcodeDto } from './dto/update-student_barcode.dto';

@Injectable()
export class StudentBarcodesService
{

  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createStudentBarCodeteDto: CreateStudentBarcodeDto )
  {
    var result = await this.prismaService.student_barcode.create( {
      data: createStudentBarCodeteDto
    } );
    return result;
  }
  async createMany ( createStudentBarCodeteDto: CreateStudentBarcodeDto[] )
  {
    var result = await this.prismaService.student_barcode.createMany( {
      data: createStudentBarCodeteDto
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.student_barcode.findMany( {

    } );

    return results;
  }

  // TODO? do we need this?
  async findAllByExamMissionId ( examMissionId: number )
  {
    var results = await this.prismaService.student_barcode.findMany( {
      where: {
        Exam_Mission_ID: examMissionId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentId ( studentId: number )
  {
    var results = await this.prismaService.student_barcode.findMany( {
      where: {
        Student_ID: studentId
      }
    } );
    return results;
  }

  // TODO? do we need this?
  async findAllByStudentIdAndExamMissionId ( studentId: number, examMissionId: number )
  {
    var results = await this.prismaService.student_barcode.findMany( {
      where: {
        Student_ID: studentId,
        Exam_Mission_ID: examMissionId
      }
    } );
    return results;
  }

  async findByBarcode ( barcode: string )
  {
    var result = await this.prismaService.student_barcode.findUnique( {
      where: {
        Barcode: barcode
      },

      include: {
        exam_mission: {
          include: {
            subjects: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
        student: {
          select: {
            ID: true,
            First_Name: true,
            Second_Name: true,
            Third_Name: true,
            school_class: {
              select: {
                ID: true,
                Name: true,
              },
            },
            grades: {
              select: {
                ID: true,
                Name: true,
              },
            },
          },
        },
      },

    }, );
    return result;
  }
  async findOne ( id: number )
  {
    var result = await this.prismaService.student_barcode.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateStudentBarCodeteDto: UpdateStudentBarcodeDto )
  {
    var result = await this.prismaService.student_barcode.update( {
      where: {
        ID: id
      },
      data: updateStudentBarCodeteDto
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.student_barcode.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

}
