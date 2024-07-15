import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaExceptionFilter } from 'src/Common/Db/prisma.filter';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateStudentBarcodeDto } from './dto/create-student_barcode.dto';
import { UpdateStudentBarcodeDto } from './dto/update-student_barcode.dto';
import { StudentBarcodesService } from './student_barcodes.service';

@UseGuards( JwtAuthGuard )
@ApiTags( "Student-Barcodes" )
@UseFilters( PrismaExceptionFilter )
@Controller( 'student-barcodes' )
export class StudentBarcodesController
{
  constructor ( private readonly studentBarcodesService: StudentBarcodesService ) { }

  @Roles( Role.SuperAdmin )
  @Post()
  create ( @Body() createStudentBarcodeDto: CreateStudentBarcodeDto )
  {
    return this.studentBarcodesService.create( createStudentBarcodeDto );
  }

  @Roles( Role.SuperAdmin )
  @Post( 'many' )
  createMany ( @Body() createStudentBarcodeDto: CreateStudentBarcodeDto[] )
  {
    return this.studentBarcodesService.createMany( createStudentBarcodeDto );
  }

  @Get()
  findAll ()
  {
    return this.studentBarcodesService.findAll();
  }

  @Get( 'barcode/:barcode' )
  findByBarcode ( @Param( 'barcode' ) barcode: string )
  {
    return this.studentBarcodesService.findByBarcode( barcode );
  }

  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.studentBarcodesService.findOne( +id );
  }

  @Get( 'student/:studentId' )
  findAllByStudentId ( @Param( 'studentId' ) studentId: string )
  {
    return this.studentBarcodesService.findAllByStudentId( +studentId );
  }

  @Get( 'exam-mission/:examMissionId' )
  findAllByExamMissionId ( @Param( 'examMissionId' ) examMissionId: string )
  {
    return this.studentBarcodesService.findAllByExamMissionId( +examMissionId );
  }

  @Get( 'student/:studentId/exam-mission/:examMissionId' )
  findAllByStudentIdAndExamMissionId ( @Param( 'studentId' ) studentId: string, @Param( 'examMissionId' ) examMissionId: string )
  {
    return this.studentBarcodesService.findAllByStudentIdAndExamMissionId( +studentId, +examMissionId );
  }

  @Roles( Role.SuperAdmin )

  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateStudentBarcodeDto: UpdateStudentBarcodeDto )
  {
    return this.studentBarcodesService.update( +id, updateStudentBarcodeDto );
  }
  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.studentBarcodesService.remove( +id );
  }
}
