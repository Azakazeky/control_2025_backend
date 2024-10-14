import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Common/Guard/local-auth.guard';
import { CreateStudentBarcodeDto } from './dto/create-student_barcode.dto';
import { UpdateStudentBarcodeDto } from './dto/update-student_barcode.dto';
import { StudentBarcodesService } from './student_barcodes.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Student-Barcodes')
@Controller('student-barcodes')
export class StudentBarcodesController {
  /**
   * The constructor for the StudentBarcodesController class.
   * @param studentBarcodesService The service that is used to
   * interact with the student barcodes in the database.
   */
  constructor(
    private readonly studentBarcodesService: StudentBarcodesService,
  ) {}

  // @Roles(Role.SuperAdmin)
  @Post()
  /**
   * Creates a new student barcode.
   * @param createStudentBarcodeDto The new student barcode data to be created.
   * @returns The newly created student barcode.
   */
  create(@Body() createStudentBarcodeDto: CreateStudentBarcodeDto) {
    return this.studentBarcodesService.create(createStudentBarcodeDto);
  }

  // @Roles(Role.SuperAdmin)
  @Post('many')
  /**
   * Creates multiple new student barcodes.
   * @param createStudentBarcodeDto The new student barcodes data to be created.
   * @returns The newly created student barcodes.
   */
  createMany(@Body() createStudentBarcodeDto: CreateStudentBarcodeDto[]) {
    return this.studentBarcodesService.createMany(createStudentBarcodeDto);
  }

  @Get('exam-room/:examRoomId')
  /**
   * Retrieves all student barcodes associated with a given exam room and exam mission.
   * @param examRoomId The exam room id.
   * @param examMissionId The exam mission id.
   * @returns All student barcodes associated with the given exam room and exam mission.
   */
  findStudentBarcodesByExamRoomIdAndExamMissionId(
    @Param('examRoomId') examRoomId: string,
    @Query('examMissionId') examMissionId: string,
  ) {
    return this.studentBarcodesService.findStudentBarcodesByExamRoomIdAndExamMissionId(
      +examRoomId,
      +examMissionId,
    );
  }
  @Get('student/exam-room/:examRoomId')
  /**
   * Retrieves all student barcodes associated with a given exam room,
   * filtered by month, year and period.
   * @param examRoomId The exam room id.
   * @param month The month to filter by.
   * @param year The year to filter by.
   * @param period Whether to filter by period or not.
   * @returns All student barcodes associated with the given exam room,
   * filtered by month, year and period.
   */
  findStudentBarcodesByExamRoomId(
    @Param('examRoomId') examRoomId: string,
    @Query('month') month: string,
    @Query('year') year: string,
    @Query('period') period: string,
  ) {
    return this.studentBarcodesService.findStudentBarcodesByExamRoomId(
      +examRoomId,
      month,
      year,
      period === 'true' ? true : false,
    );
  }
  @Get()
  /**
   * Retrieves all student barcodes in the database.
   * @returns All student barcodes in the database.
   */
  findAll() {
    return this.studentBarcodesService.findAll();
  }

  @Get('barcode/:barcode')
  /**
   * Retrieves a student barcode by its barcode.
   * @param barcode The barcode of the student barcode to retrieve.
   * @returns The student barcode with the given barcode.
   * @throws {NotFoundException} If no student barcode with the given
   * barcode is found.
   */
  findByBarcode(@Param('barcode') barcode: string) {
    return this.studentBarcodesService.findByBarcode(barcode);
  }

  @Get(':id')
  /**
   * Retrieves a single student barcode by its id.
   * @param id The id of the student barcode to retrieve.
   * @returns The student barcode with the given id.
   * @throws {NotFoundException} If no student barcode with the given
   * id is found.
   */
  findOne(@Param('id') id: string) {
    return this.studentBarcodesService.findOne(+id);
  }

  @Get('student/:studentId')
  /**
   * Retrieves all student barcodes for a given student.
   * @param studentId The id of the student whose student barcodes should be retrieved.
   * @returns All student barcodes of the given student.
   */
  findAllByStudentId(@Param('studentId') studentId: string) {
    return this.studentBarcodesService.findAllByStudentId(+studentId);
  }

  @Get('exam-mission/:examMissionId')
  /**
   * Retrieves all student barcodes associated with a given exam mission.
   * @param examMissionId The exam mission id.
   * @returns All student barcodes associated with the given exam mission.
   */
  findAllByExamMissionId(@Param('examMissionId') examMissionId: string) {
    return this.studentBarcodesService.findAllByExamMissionId(+examMissionId);
  }

  @Get('student/:studentId/exam-mission/:examMissionId')
  /**
   * Retrieves all student barcodes for a given student and exam mission.
   * @param studentId The id of the student whose student barcodes should be retrieved.
   * @param examMissionId The exam mission id.
   * @returns All student barcodes of the given student and exam mission.
   */
  findAllByStudentIdAndExamMissionId(
    @Param('studentId') studentId: string,
    @Param('examMissionId') examMissionId: string,
  ) {
    return this.studentBarcodesService.findAllByStudentIdAndExamMissionId(
      +studentId,
      +examMissionId,
    );
  }

  // @Roles(Role.SuperAdmin, Role.ControlOfficer, Role.OperationCO)
  @Patch(':id')
  /**
   * Updates a student barcode.
   * @param id The id of the student barcode to be updated.
   * @param updateStudentBarcodeDto The student barcode data to be updated.
   * @returns The updated student barcode.
   */
  update(
    @Param('id') id: string,
    @Body() updateStudentBarcodeDto: UpdateStudentBarcodeDto,
  ) {
    return this.studentBarcodesService.update(+id, updateStudentBarcodeDto);
  }
  // @Roles(Role.SuperAdmin)
  @Delete(':id')
  /**
   * Removes a student barcode by its id.
   * @param id The id of the student barcode to be removed.
   * @returns The removed student barcode.
   * @throws {NotFoundException} If no student barcode with the given
   * id is found.
   */
  remove(@Param('id') id: string) {
    return this.studentBarcodesService.remove(+id);
  }
}
