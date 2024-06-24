import { PartialType } from "@nestjs/swagger";
import { CreateStudentSeatNumberDto } from "./create-student-seat-numbers.dto";

export class UpdateStudentSeatNumbersDto extends PartialType( CreateStudentSeatNumberDto ) { }