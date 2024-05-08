import { Injectable } from '@nestjs/common';
import { CreateClassDeskDto } from './dto/create-class_desk.dto';
import { UpdateClassDeskDto } from './dto/update-class_desk.dto';

@Injectable()
export class ClassDeskService {
  create(createClassDeskDto: CreateClassDeskDto) {
    return 'This action adds a new classDesk';
  }

  findAll() {
    return `This action returns all classDesk`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classDesk`;
  }

  update(id: number, updateClassDeskDto: UpdateClassDeskDto) {
    return `This action updates a #${id} classDesk`;
  }

  remove(id: number) {
    return `This action removes a #${id} classDesk`;
  }
}
