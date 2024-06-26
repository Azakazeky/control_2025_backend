import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
import { CreateManyClassDeskDto } from './dto/create-many-class-desk.dto';
import { UpdateClassDeskDto } from './dto/update-class_desk.dto';

@Injectable()
export class ClassDeskService
{
  constructor ( private readonly prismaService: PrismaService ) { }

  async create ( createClassDeskDto: CreateClassDeskDto )
  {
    var result = await this.prismaService.class_desk.create( {
      data: createClassDeskDto
    } );
    return result;
  }

  async createMany ( createManyClassDeskDto: CreateManyClassDeskDto )
  {
    var result: any;
    createManyClassDeskDto.Rows.map( async ( row, index ) =>
    {
      for ( var i = 0; i < row; i++ )
      {
        await this.prismaService.class_desk.create( {
          data: {
            Cloumn_Num: index,
            Row_Num: i,
            School_Class_ID: createManyClassDeskDto.School_Class_ID
          }
        } );
      }
    } );
    return result;
  }

  async findAll ()
  {
    var results = await this.prismaService.class_desk.findMany( {

    } );

    return results;
  }
  async findAllByClassId ( schoolClassId: number )
  {
    var results = await this.prismaService.class_desk.findMany( {
      where: {
        School_Class_ID: schoolClassId
      },
      orderBy: {
        Cloumn_Num: 'asc',
      }
    } );
    return results;
  }

  async findOne ( id: number )
  {
    var result = await this.prismaService.class_desk.findUnique( {
      where: {
        ID: id
      },

    } );
    return result;
  }

  async update ( id: number, updateClassDeskDto: UpdateClassDeskDto )
  {
    var result = await this.prismaService.class_desk.update( {
      where: {
        ID: id
      },
      data: updateClassDeskDto
    } );
    return result;
  }

  async removeAllByClassId ( schoolClassId: number )
  {
    var result = await this.prismaService.class_desk.deleteMany( {
      where: {
        School_Class_ID: schoolClassId
      }
    } );
    return result;
  }

  async remove ( id: number )
  {
    var result = await this.prismaService.class_desk.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

  // TODO? need to check how to activate and deactivate
  //? no Active field in class_desk table
  // async activate ( id: number )
  // {
  //   var result = await this.prismaService.class_desk.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 1
  //     }
  //   } );
  //   return result;
  // }

  // async deactivate ( id: number )
  // {
  //   var result = await this.prismaService.class_desk.update( {
  //     where: {
  //       ID: id
  //     },
  //     data: {
  //       Active: 0
  //     }
  //   } );
  //   return result;
  // }

}
