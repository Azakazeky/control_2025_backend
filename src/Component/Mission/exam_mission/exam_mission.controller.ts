import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import { Body, Controller, Delete, Get, Param, ParseFilePipeBuilder, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';
import { ExamMissionService } from './exam_mission.service';

@UseGuards( JwtAuthGuard )
@ApiTags( "Exam-Mission" )
@Controller( 'exam-mission' )
export class ExamMissionController
{
  constructor ( private readonly examMissionService: ExamMissionService ) { }

  @Roles( Role.SuperAdmin )

  @Post()
  create ( @Body() createExamMissionDto: CreateExamMissionDto )
  {
    return this.examMissionService.create( createExamMissionDto );
  }

  @Get()
  findAll ()
  {
    return this.examMissionService.findAll();
  }

  @Get( 'subject/:subjectId' )
  findAllBySubjectId ( @Param( 'subjectId' ) subjectId: string )
  {
    return this.examMissionService.findAllBySubjectId( +subjectId );
  }

  @Get( 'control-mission/:controlMissionId' )
  findAllByControlMissionId ( @Param( 'controlMissionId' ) controlMissionId: string )
  {
    return this.examMissionService.findAllByControlMissionId( +controlMissionId );
  }

  @Get( 'subject/:subjectId/control-mission/:controlMissionId' )
  findAllBySubjectIdAndControlMissionId ( @Param( 'subjectId' ) subjectId: string, @Param( 'controlMissionId' ) controlMissionId: string )
  {
    return this.examMissionService.findAllBySubjectIdAndControlMissionId( +subjectId, +controlMissionId );
  }
  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.examMissionService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )
  @UseInterceptors( FileInterceptor( 'pdf' ) )
  @Patch( ':id' )
  update ( @Param( 'id' ) id: string, @Body() updateExamMissionDto: UpdateExamMissionDto, @UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator(
        {
          fileType: 'application/octet-stream',
        }
      )
      .build( {
        fileIsRequired: false,
      } ),
  )
  pdf?: File )
  {
    return this.examMissionService.update( +id, updateExamMissionDto );
  }

  @Roles( Role.SuperAdmin )

  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.examMissionService.remove( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string )
  {
    return this.examMissionService.activate( +id );
  }

  @Roles( Role.SuperAdmin )

  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string )
  {
    return this.examMissionService.deactivate( +id );
  }
}
