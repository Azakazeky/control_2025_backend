import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
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

  async remove ( id: number )
  {
    var result = await this.prismaService.class_desk.delete( {
      where: {
        ID: id
      }
    } );
    return result;
  }

}
