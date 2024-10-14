import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CreateExamMissionDto } from './dto/create-exam_mission.dto';
import { UpdateExamMissionDto } from './dto/update-exam_mission.dto';
import { ExamMissionService } from './exam_mission.service';

// @UseGuards( JwtAuthGuard )
@ApiTags('Exam-Mission')
@Controller('exam-mission')
export class ExamMissionController {
  constructor(private readonly examMissionService: ExamMissionService) {}

  // @Roles(Role.SuperAdmin, Role.AcademicDean)
  @Post()
  /**
   * Creates a new exam mission.
   * @param createExamMissionDto the exam mission data to be created
   * @param req the request object
   * @returns the newly created exam mission
   */
  create(
    @Body() createExamMissionDto: CreateExamMissionDto,
    @Req() req: Request,
  ) {
    return this.examMissionService.create(
      createExamMissionDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  /**
   * Retrieves all exam missions.
   * @returns all exam missions
   */
  findAll() {
    return this.examMissionService.findAll();
  }

  @Get('subject/:subjectId')
  /**
   * Retrieves all exam missions associated with a subject.
   * @param subjectId the subject id
   * @returns all exam missions associated with the subject
   */
  findAllBySubjectId(@Param('subjectId') subjectId: string) {
    return this.examMissionService.findAllBySubjectId(+subjectId);
  }

  @Get('control-mission/:controlMissionId')
  /**
   * Retrieves all exam missions associated with a control mission.
   * @param controlMissionId the control mission id
   * @returns all exam missions associated with the control mission
   */
  findAllByControlMissionId(
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.examMissionService.findAllByControlMissionId(+controlMissionId);
  }

  @Get('subject/:subjectId/control-mission/:controlMissionId')
  /**
   * Retrieves all exam missions associated with a subject and control mission.
   * @param subjectId the subject id
   * @param controlMissionId the control mission id
   * @returns all exam missions associated with the subject and control mission
   */
  findAllBySubjectIdAndControlMissionId(
    @Param('subjectId') subjectId: string,
    @Param('controlMissionId') controlMissionId: string,
  ) {
    return this.examMissionService.findAllBySubjectIdAndControlMissionId(
      +subjectId,
      +controlMissionId,
    );
  }
  @Get(':id')
  /**
   * Retrieves a single exam mission by id.
   * @param id the id of the exam mission
   * @returns the exam mission with the specified id
   */
  findOne(@Param('id') id: string) {
    return this.examMissionService.findOne(+id);
  }

  // @Roles(
  //   Role.SuperAdmin,
  //   Role.ControlOfficer,
  //   Role.OperationCO,
  //   Role.AcademicDean,
  // )
  @Patch(':id')
  /**
   * Updates an exam mission.
   * @param id the exam mission id
   * @param updateExamMissionDto the exam mission data to be updated
   * @param req the request object
   * @returns the updated exam mission
   */
  update(
    @Param('id') id: string,
    @Body() updateExamMissionDto: UpdateExamMissionDto,
    @Req() req: Request,
  ) {
    return this.examMissionService.update(
      +id,
      updateExamMissionDto,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin, Role.AcademicDean, Role.OperationCO)
  @Delete(':id')
  /**
   * Removes an exam mission by its id.
   * @param id the exam mission id
   */
  remove(@Param('id') id: string) {
    return this.examMissionService.remove(+id);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('activate/:id')
  /**
   * Activates an exam mission.
   * @param id the exam mission id
   * @param req the request object
   * @returns the activated exam mission
   */
  activate(@Param('id') id: string, @Req() req: Request) {
    return this.examMissionService.activate(+id, req.headers['user']['userId']);
  }

  // @Roles(Role.SuperAdmin)
  @Patch('deactivate/:id')
  /**
   * Deactivates an exam mission.
   * @param id the exam mission id
   * @param req the request object
   * @returns the deactivated exam mission
   */
  deactivate(@Param('id') id: string, @Req() req: Request) {
    return this.examMissionService.deactivate(
      +id,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin, Role.AcademicDean)
  @Get('previewExam/:id')
  /**
   * Previews an exam by its id.
   * @param id the exam id
   * @returns the exam preview
   */
  preview(@Param('id') id: string) {
    return this.examMissionService.previewExamById(+id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @Post('upload/')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/Exams/',
        filename: function (req, file, callback) {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, file.originalname + randomName);
        },
      }),
    }),
  )
  /**
   * Uploads an exam file.
   * @param file the file to be uploaded
   * @returns the uploaded file name
   * @throws {HttpException} if an error occurs while uploading the file to the Google Cloud Storage bucket
   */
  async Upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          //fileType: 'application/pdf'
          fileType: 'application/octet-stream',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: File,
  ) {
    const fileLocation = `uploads/Exams/${file.filename}`;
    try {
      var result = await this.examMissionService.uploadExamFiles(fileLocation);
      return result.name;
    } catch (error) {
      console.log(error);
      throw new HttpException('Error From Google Bucket :: ' + error, 600);
    }
  }
}
