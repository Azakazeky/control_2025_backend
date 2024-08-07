import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import
{
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import Role from 'src/Common/Guard/role.enum';
import { Roles } from 'src/Common/Guard/roles.decorator';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';
import { ExamMissionService } from './exam_mission.service';

// @UseGuards( JwtAuthGuard )
@ApiTags( 'Exam-Mission' )
@Controller( 'exam-mission' )
export class ExamMissionController
{
  constructor ( private readonly examMissionService: ExamMissionService ) { }

  @Roles( Role.SuperAdmin )
  @Post()
  create (
    @Body() createExamMissionDto: CreateExamMissionDto,
    @Req() req: Request,
  )
  {
    return this.examMissionService.create(
      createExamMissionDto,
      req.headers[ 'user' ][ 'userId' ],
    );
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
  findAllByControlMissionId (
    @Param( 'controlMissionId' ) controlMissionId: string,
  )
  {
    return this.examMissionService.findAllByControlMissionId( +controlMissionId );
  }

  @Get( 'subject/:subjectId/control-mission/:controlMissionId' )
  findAllBySubjectIdAndControlMissionId (
    @Param( 'subjectId' ) subjectId: string,
    @Param( 'controlMissionId' ) controlMissionId: string,
  )
  {
    return this.examMissionService.findAllBySubjectIdAndControlMissionId(
      +subjectId,
      +controlMissionId,
    );
  }
  @Get( ':id' )
  findOne ( @Param( 'id' ) id: string )
  {
    return this.examMissionService.findOne( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( ':id' )
  update (
    @Param( 'id' ) id: string,
    @Body() updateExamMissionDto: UpdateExamMissionDto,
    @Req() req: Request,
  )
  {
    return this.examMissionService.update(
      +id,
      updateExamMissionDto,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Roles( Role.SuperAdmin )
  @Delete( ':id' )
  remove ( @Param( 'id' ) id: string )
  {
    return this.examMissionService.remove( +id );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'activate/:id' )
  activate ( @Param( 'id' ) id: string, @Req() req: Request )
  {
    return this.examMissionService.activate( +id, req.headers[ 'user' ][ 'userId' ] );
  }

  @Roles( Role.SuperAdmin )
  @Patch( 'deactivate/:id' )
  deactivate ( @Param( 'id' ) id: string, @Req() req: Request )
  {
    return this.examMissionService.deactivate(
      +id,
      req.headers[ 'user' ][ 'userId' ],
    );
  }

  @Get( 'previewExam/:id' )
  preview ( @Param( 'id' ) id: string )
  {
    return this.examMissionService.previewExambyId( +id );
  }

  @ApiConsumes( 'multipart/form-data' )
  @ApiBody( {
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  } )
  @Post( 'upload/' )
  @UseInterceptors(
    FileInterceptor( 'file', {
      storage: diskStorage( {
        destination: './uploads/Exams/',
        filename: function ( req, file, callback )
        {
          const randomName = Array( 32 )
            .fill( null )
            .map( () => Math.round( Math.random() * 16 ).toString( 16 ) )
            .join( '' );
          callback( null, file.originalname + randomName );
        },
      } ),
    } ),
  )
  async Upload (
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator( {
          //fileType: 'application/pdf'
          fileType: 'application/octet-stream',
        } )
        .build( {
          fileIsRequired: false,
        } ),
    )
    file?: File,
  )
  {
    const fileLocation = `uploads/Exams/${ file.filename }`;
    try
    {
      var result = await this.examMissionService.uploadExamFiles( fileLocation );
      return result.name;
    } catch ( error )
    {
      console.log( error );
      throw new HttpException( 'Error From Google Bucket :: ' + error, 600 );
    }
  }
}
