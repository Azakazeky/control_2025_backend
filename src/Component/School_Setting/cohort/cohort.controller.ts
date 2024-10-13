import { File, FileInterceptor } from '@nest-lab/fastify-multer';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CohortService } from './cohort.service';
import { AddSubjectsToCohort, CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';
let XLSX = require('xlsx');

@UseGuards(JwtAuthGuard)
@ApiTags('cohort')
@Controller('cohort')
export class CohortController {
  constructor(private readonly cohortService: CohortService) {}
  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Post()
  create(@Body() createCohortDto: CreateCohortDto, @Req() req: Request) {
    return this.cohortService.create(
      createCohortDto,
      req.headers['user']['userId'],
    );
  }
  @Post('operation-create-cohort')
  operationCreateCohort(
    @Body() createCohortDto: CreateCohortDto,
    @Req() req: Request,
  ) {
    return this.cohortService.operationCreateCohort(
      createCohortDto,
      req.headers['user']['userId'],
    );
  }

  @Get()
  findAll() {
    return this.cohortService.findAll();
  }

  @Get('school-type')
  findAllBySchoolType(@Req() req: Request) {
    const id = req.headers['user']['schoolId'];
    return this.cohortService.findAllBySchoolId(+id);
  }
  @Get('school/:id')
  findAllBySchoolTypeId(@Param('id') id: string) {
    return this.cohortService.findAllBySchoolId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cohortService.findOne(+id);
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @ApiBody({ type: [AddSubjectsToCohort] })
  @Post('Connect-Subject/:id')
  async addSubjects(
    @Param('id') id: string,
    @Body() addSubjectsToCohort: [number],
  ) {
    return this.cohortService.addSubjects(+id, addSubjectsToCohort);
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @ApiBody({ type: [AddSubjectsToCohort] })
  @Post('disconnect-Subject/:id')
  async removeSubjectFromCohort(
    @Param('id') id: string,
    @Body() subjectId: number,
  ) {
    return this.cohortService.removeSubjects(+id, subjectId);
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCohortDto: UpdateCohortDto,
    @Req() req: Request,
  ) {
    return this.cohortService.update(
      +id,
      updateCohortDto,
      req.headers['user']['userId'],
    );
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cohortService.remove(+id);
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Patch('activate/:id')
  activate(@Param('id') id: string) {
    return this.cohortService.activate(+id);
  }

  // @Roles(Role.SuperAdmin, Role.OperationCO)
  @Patch('deactivate/:id')
  deactivate(@Param('id') id: string) {
    return this.cohortService.deactivate(+id);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  @Post('/uploadXlsx')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = file.originalname.split('.').pop();
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async handleUpload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        // .addFileTypeValidator({
        //   // fileType: 'application/pdf'
        //   // fileType: 'application/octet-stream',
        // })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: File,
  ) {
    console.log('file', file);
    let workbook = XLSX.readFile(file.path);
    var sheet_name_list = workbook.SheetNames;
    var worksheet = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]],
      { header: 1, blankrows: false },
    );
    let Outindex = 0;
    let resultArray;

    for (Outindex = 0; Outindex < worksheet.length; Outindex++) {
      let newArray = worksheet[Outindex];
      resultArray = newArray.filter(Boolean);
      let newCohort: CreateCohortDto = new CreateCohortDto();
      newCohort.Name = resultArray[1].trim();
      newCohort.School_Type_ID = resultArray[0];

      var createdCohrot = await this.cohortService.prismaService.cohort.upsert({
        create: {
          Created_By: 1,
          ...newCohort,
        },
        update: { Name: newCohort.Name },
        where: { Name: newCohort.Name },
      });

      var createsSUbjects =
        await this.cohortService.prismaService.subjects.upsert({
          create: {
            Name: resultArray[2].trim(),
            Created_By: 1,
          },
          update: { Name: resultArray[2].trim() },
          where: { Name: resultArray[2].trim() },
        });
      // var subject = await this.cohortService.prismaService.subjects.findFirst({
      //   where: {
      //     Name: resultArray[2].trim()
      //   },
      // });

      await this.cohortService.prismaService.school_type_has_subjects.upsert({
        update: {
          school_type_ID: resultArray[0],
          subjects_ID: createsSUbjects.ID,
        },
        where: {
          school_type_ID_subjects_ID: {
            school_type_ID: resultArray[0],
            subjects_ID: createsSUbjects.ID,
          },
        },
        create: {
          school_type_ID: resultArray[0],
          subjects_ID: createsSUbjects.ID,
        },
      });
      await this.cohortService.prismaService.cohort_has_subjects.upsert({
        create: {
          Cohort_ID: createdCohrot.ID,
          Subjects_ID: createsSUbjects.ID,
        },
        update: {
          Cohort_ID: createdCohrot.ID,
          Subjects_ID: createsSUbjects.ID,
        },
        where: {
          Cohort_ID_Subjects_ID: {
            Cohort_ID: createdCohrot.ID,
            Subjects_ID: createsSUbjects.ID,
          },
        },
      });

      console.log(`${Outindex} has been added To Subjects! ✅`);
      console.log(`${resultArray[2].trim()} has been added To Subjects! ✅`);
      console.log(`${resultArray[1].trim()} has been added To Cohort! ✅`);
    }

    console.log(`All Cohort  are in place! ✅`);
    return 'File upload Done';
  }
}
