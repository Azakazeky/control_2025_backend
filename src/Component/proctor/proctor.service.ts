import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Common/Db/prisma.service';
import {
  AssignProctorToExamRoomDto,
  CreateProctorDto,
} from './dto/create-proctor.dto';
import { UpdateProctorDto } from './dto/update-proctor.dto';

@Injectable()
export class ProctorService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProctorDto: CreateProctorDto, createdBy: number) {
    var result = await this.prismaService.proctors.create({
      data: { ...createProctorDto, Created_By: createdBy },
    });
    return result;
  }

  async assignProctorToExamMission(
    assignProctorToExamRoomDto: AssignProctorToExamRoomDto,
    createdBy: number,
  ) {
    var result = await this.prismaService.proctor_in_room.create({
      data: { ...assignProctorToExamRoomDto, Created_By: createdBy },
      include: {
        proctors: true,
      },
    });
    return result;
  }

  async unassignProctorFromExamRoom(id: number) {
    var result = await this.prismaService.proctor_in_room.delete({
      where: {
        ID: id,
      },
      include: {
        proctors: true,
      },
    });
    return result;
  }

  async findAllBySchoolId(schoolId: number) {
    var results = await this.prismaService.proctors.findMany({
      where: {
        School_Id: schoolId,
        isFloorManager: null,
      },
    });
    return results;
  }

  async findAllByExamRoomId(examRoomId: number, month: string, year: string) {
    var results = await this.prismaService.proctor_in_room.findMany({
      where: {
        exam_room_ID: examRoomId,
        Month: month,
        Year: year,
      },
      include: {
        proctors: true,
      },
    });
    return results;
  }

  async findOne(id: number) {
    var result = await this.prismaService.proctors.findUnique({
      where: {
        ID: id,
      },
    });
    return result;
  }

  async update(id: number, updateProctorDto: UpdateProctorDto) {
    var result = this.prismaService.proctors.update({
      where: {
        ID: id,
      },
      data: updateProctorDto,
    });
    return result;
  }

  async remove(id: number) {
    var result = await this.prismaService.proctors.delete({
      where: {
        ID: id,
      },
    });
    return result;
  }
}
