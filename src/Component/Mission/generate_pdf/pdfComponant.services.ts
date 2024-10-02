import { Injectable } from '@nestjs/common';
const bwipjs = require('bwip-js');
const fs = require('fs');

@Injectable()
export class ComponantServices {
  generateSeatNumber(
    doc,
    name: String,
    lastName: String,
    room: String,
    seatNumber: String,
    grade: String,
    rel: String,
    second: String,
  ) {
    const x = 20;
    if (doc.y > 700) {
      doc.addPage();
    }
    const y = doc.y + 5; // first hight
    // left
    doc
      .opacity(1)
      .rect(x, y, 280, 135)
      .rect(310, y, 280, 135)
      .stroke()
      .fontSize(11)
      .moveDown(1.5)

      .font('Times-Bold')
      .text('Name: ' + name + ' ' + lastName, x + 15, doc.y, {
        align: 'left',
        lineBreak: false,
      })
      .text('Name: ' + name + ' ' + lastName, 320)
      .moveDown(1)
      .text('Seat No: ' + seatNumber, x + 15, doc.y, {
        lineBreak: false,
      })

      .text('Seat No: ' + seatNumber, 320)
      .moveDown(1)
      .text('Room: ' + room, x + 15, doc.y, {
        lineBreak: false,
      })
      .text('Room: ' + room, 320)
      .moveDown(2.5)
      .text(
        grade + '                     ' + rel + '                  ' + second,
        x + 15,
        doc.y,
        {
          lineBreak: false,
        },
      )
      .text(
        grade + '                     ' + rel + '                  ' + second,
        320,
      );

    // add image to back ground
    doc
      .opacity(0.2)
      .image('assetss/nis_logo.png', x + 400, y + 20, { width: 70 })
      .lineJoin('miter')
      .image('assetss/nis_logo.png', x + 120, y + 20, { width: 70 })
      .lineJoin('miter');
    doc.y = y + 150;
  }

  generateHeaderIB(doc) {
    doc
      .image('assetss/nis_logo.png', 50, 10, { width: 70 })

      .moveTo(430, 20)
      .lineTo(430, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(580, 70)
      .lineTo(580, 20)
      .stroke()
      .moveTo(580, 20)
      .lineTo(430, 20)
      .stroke()
      .moveDown(1)

      .fillColor('#000000')
      .fontSize(16)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .moveDown(2)
      .text('Advanced Education', { align: 'center' })
      .fontSize(16)
      .text('Dr. Nermien Ismail International Baccalaureate Schools', {
        align: 'center',
      })
      .fontSize(16)
      .font('assetss/kuenstler_script_bold.otf')
      .text('Inspiring, Empowering, Educating', { align: 'center' })
      .fontSize(10)
      .font('Times-Bold')
      .text('From the', { align: 'center' })
      .fontSize(18)
      .text('Office of the Examination Center', { align: 'center' })
      .fillColor('#000000')
      .rect(10, doc.y, 580, 0.1)
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#000000')
      .font('Times-Roman')
      .text(
        'Our mission is to empower our students to utilize their potential in a diverse and challenging world.We provide',
        { align: 'center' },
      )
      .text(
        'outstanding education for the mind, spirit and body using state-of-the-art methodologies while fostering',
        { align: 'center' },
      )
      .text('intercultural awareness, and lifelong learning .', {
        align: 'center',
      })
      .moveDown(0.2)
      .rect(10, doc.y, 580, 0.1);
  }

  generateHeaderAm(doc) {
    doc
      .image('assetss/nis_logo.png', 50, 10, { width: 70 })

      .moveTo(430, 20)
      .lineTo(430, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(580, 70)
      .lineTo(580, 20)
      .stroke()
      .moveTo(580, 20)
      .lineTo(430, 20)
      .stroke()
      .moveDown(3)

      .fillColor('#000000')
      .fontSize(16)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .moveDown(1.5)
      .text('Advanced Education', { align: 'center' })
      .fontSize(16)
      .text('Dr. Nermien Ismail American School', { align: 'center' })
      .fontSize(16)
      .font('assetss/kuenstler_script_bold.otf')
      .text('Inspiring, Empowering, Educating', { align: 'center' })
      .font('Times-Bold')
      .fontSize(10)
      .text('From the', { align: 'center' })
      .fontSize(16)
      .text('Office of the Examination Center', { align: 'center' })
      .fillColor('#000000')
      .rect(10, doc.y, 580, 0.1)
      .fontSize(12)
      .moveDown(0.5)
      .fillColor('#000000')
      .font('Times-Roman')
      .text(
        'Our mission is to empower our students to utilize their potential in a diverse and challenging world.We provide',
        { align: 'center' },
      )
      .text(
        'outstanding education for the mind, spirit and body using state-of-the-art  methodologies while fostering ',
        { align: 'center' },
      )
      .text('intercultural awareness, and lifelong learning. ', {
        align: 'center',
      })
      .moveDown(0.2)
      .rect(10, doc.y, 580, 0.1);
  }
  async generateFooterAm(
    doc,
    name: String,
    room: String,
    date: String,
    seatNumber: String,
    barcode: String,
    Writing: Boolean,
    Version: String,
  ) {
    doc.y = 600;
    doc.x = 40;

    if (name.length > 36) {
      name = name.substr(0, 35);
    }
    doc
      .fillColor('#000000')
      .rect(10, doc.y, 580, 0.1)
      .fontSize(16)
      .font('Times-Roman')
      .text('Name : ' + name, doc.x, doc.y + 10, { align: 'left', width: 350 })
      .text('Class : ' + room, doc.x, doc.y + 10, { align: 'left', width: 300 })
      .text('Date : ' + date, doc.x, doc.y + 10, { align: 'left', width: 300 });
    if (!Writing)
      doc
        .text('Seat Number : ' + seatNumber, doc.x, doc.y + 10, {
          align: 'left',
          width: 300,
        })
        .font('Times-Bold')
        .moveUp();
    // .moveDown()
    if (Version)
      doc.text(' Version : ' + Version, doc.x, doc.y, {
        align: 'center',
        underline: true,
      });

    doc
      .moveDown()
      .fontSize(12)
      .font('Times-Bold')
      .text(
        'Honor Pledge: “Upon my honor I have neither given nor received aid with this work“',
        { align: 'center', width: 500 },
      )
      .moveDown(0.5)
      .text(
        'Student’s signature : ___________________________________',
        doc.x,
        doc.y + 3,
        { align: 'center', width: 500 },
      )

      .moveTo(400, 620)
      .lineTo(400, 670)
      .stroke()

      .moveTo(400, 670)
      .lineTo(550, 670)
      .stroke()

      .moveTo(400, 670)
      .lineTo(550, 670)
      .stroke()

      .moveTo(550, 670)
      .lineTo(550, 620)
      .stroke()

      .moveTo(550, 620)
      .lineTo(400, 620)
      .stroke();

    console.log('start ' + barcode);
    //barcode

    var png = await bwipjs.toBuffer({
      bcid: 'code39', // Barcode type
      text: barcode, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: false, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });
    if (png) {
      png.toString('base64');
      doc.image(png, 440, 30, { height: 30, width: 130 }); // in header
      doc.image(png, 410, 630, { height: 30, width: 130 });
    } else {
      console.log(png);
    }
  }
  generateBody(
    doc,
    grade: String,
    subject: String,
    Duration: String,
    Date: String,
    writing: boolean,
  ) {
    doc.x = 80;
    doc
      .fillColor('#000000')
      // .stroke()
      .moveDown(2.5)
      .image('assetss/pic1_color.png', {
        hight: 70,
        width: 100,
        align: 'center',
      })
      .moveDown(5.5);
    doc
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .fontSize(16)
      .text(subject, { align: 'center', width: 100 })
      .moveDown();

    if (writing) doc.fontSize(10).text('Writing Assessment', { width: 180 });

    doc
      .fontSize(16)
      .text(grade, { align: 'center', width: 100 })
      .moveDown()
      .fontSize(16)
      .text(Duration, { align: 'center', width: 100 })
      .moveDown()
      .fontSize(16)
      .text(Date, { align: 'center', width: 100 })
      .moveDown()
      .image('assetss/pic2_color.png', {
        hight: 70,
        width: 100,
        align: 'center',
      })
      .fillColor('#444444')
      .font('Times-Bold');
  }
  generateTableAm(doc, z: number) {
    // z is number of questions
    var x = 280;
    var y = 300;
    this.generateTableHeader(doc, x, y - 40);
    for (let i = 0; i < z; i++) {
      if (i == 0) {
        this.generateDrawRowAm(doc, x, y, i);
      } else {
        this.generateDrawRowAm(doc, x, y, i);
      }
    }
    this.generateTableFotterAm(doc, x, y + z * 20);
  }
  generateDrawRowAm(doc, x, y, i) {
    y = y + i * 20;

    doc
      // .rect(x, y, x + 20, 1)
      .moveTo(x, y)
      .lineTo(x, y + 20)
      .stroke()
      .font('Times-Bold')
      .text('S' + (i + 1), x + 20, y + 5)
      .moveTo(x + 60, y)
      .lineTo(x + 60, y + 20)
      .stroke()
      .moveTo(x + 120, y)
      .lineTo(x + 120, y + 20)
      .stroke()
      .moveTo(x + 180, y)
      .lineTo(x + 180, y + 20)
      .stroke()
      .moveTo(x + 240, y)
      .lineTo(x + 240, y + 20)
      .stroke()
      .moveTo(x + 300, y)
      .lineTo(x + 300, y + 20)
      .stroke()
      .moveTo(x, y + 20)
      .lineTo(x + 300, y + 20)
      .stroke();
  }
  generateTableHeader(doc, x, y) {
    doc
      .fontSize(12)
      .rect(x, y, x + 20, 1)
      .lineTo(x, y + 40)
      .stroke()
      .moveTo(x + 60, y)
      .lineTo(x + 60, y + 40)
      .stroke()
      .font('Helvetica-Bold')
      .text('Section\n #', x + 2, y + 5, { width: 60, align: 'center' })

      .moveTo(x + 120, y)
      .lineTo(x + 120, y + 40)
      .stroke()
      .text('Points\nEarned', x + 62, y + 5, { width: 60, align: 'center' })

      .moveTo(x + 180, y)
      .lineTo(x + 180, y + 40)
      .stroke()
      .text('Points\nPossible', x + 122, y + 5, { width: 60, align: 'center' })

      .moveTo(x + 240, y)
      .lineTo(x + 240, y + 40)
      .stroke()
      .text('Teacher\nInitials', x + 182, y + 5, { width: 60, align: 'center' })

      .moveTo(x + 300, y)
      .lineTo(x + 300, y + 40)
      .stroke()
      .text('HoD\nInitials', x + 242, y + 5, { width: 60, align: 'center' })
      .moveTo(x, y + 40)
      .lineTo(x + 300, y + 40)
      .stroke();
  }
  generateTableFotterAm(doc, x, y) {
    doc
      .fontSize(14)
      .lineTo(x, y + 40)
      .stroke()
      .moveTo(x + 60, y)
      .lineTo(x + 60, y + 40)
      .stroke()

      .text('Exam Total', x + 2, y + 5, { width: 55, align: 'center' })

      .moveTo(x + 120, y)
      .lineTo(x + 120, y + 40)
      .stroke()
      .moveTo(x + 180, y)
      .lineTo(x + 180, y + 40)
      .stroke()
      .moveTo(x + 300, y)
      .lineTo(x + 300, y + 40)
      .stroke()
      .moveTo(x, y)
      .lineTo(x, y + 40)
      .stroke()

      .text('%', x + 242, y + 15, { width: 80, align: 'center' })
      .rect(x, y + 40, x + 20, 1);
  }
  generateHeaderBr(doc) {
    doc
      .image('assetss/nis_logo.png', 50, 10, { width: 70 })

      .moveTo(430, 20)
      .lineTo(430, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(580, 70)
      .lineTo(580, 20)
      .stroke()
      .moveTo(580, 20)
      .lineTo(430, 20)
      .stroke()
      .moveDown(1)

      .fillColor('#000000')
      .fontSize(16)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .moveDown(1.5)
      .text('Advanced Education', { align: 'center' })
      .fontSize(16)

      .text('Dr. Nermien Ismail British School', { align: 'center' })
      .fontSize(16)
      .font('assetss/kuenstler_script_bold.otf')
      .text('Inspiring, Empowering, Educating', { align: 'center' })
      .fontSize(10)
      .font('Times-Bold')
      .text('From the', { align: 'center' })
      .fontSize(18)
      .text('Office of the Examination Center', { align: 'center' })
      .fillColor('#000000')
      .rect(10, doc.y, 580, 0.1)
      .moveDown(0.5)
      .fontSize(12)
      .fillColor('#000000')
      .font('Times-Roman')
      .text(
        'Our mission is to empower our students to utilize their potential in a diverse and challenging world.We provide',
        { align: 'center' },
      )
      .text(
        'outstanding education for the mind, spirit and body using state-of-the-art methodologies while fostering',
        { align: 'center' },
      )
      .text('intercultural awareness, and lifelong learning .', {
        align: 'center',
      })
      .moveDown(0.2)
      .rect(10, doc.y, 580, 0.1);
  }

  generateTableBr(doc, z: number) {
    // z is number of questions
    var x = 280;
    var y = 260;
    this.generateTableHeader(doc, x, y - 40);
    for (let i = 0; i < z; i++) {
      if (i == 0) {
        this.generateDrawRowBr(doc, x, y, i);
      } else {
        this.generateDrawRowBr(doc, x, y, i);
      }
    }
    this.generateTableFotterBr(doc, x, y + z * 16);
  }
  generateDrawRowBr(doc, x, y, i) {
    y = y + i * 16;

    doc
      // .rect(x, y, x + 20, 1)
      .moveTo(x, y)
      .lineTo(x, y + 20)
      .stroke()
      .font('Times-Bold')
      .fontSize(10)
      .text('P' + (i + 1), x + 20, y + 7)
      .moveTo(x + 60, y)
      .lineTo(x + 60, y + 20)
      .stroke()
      .moveTo(x + 120, y)
      .lineTo(x + 120, y + 20)
      .stroke()
      .moveTo(x + 180, y)
      .lineTo(x + 180, y + 20)
      .stroke()
      .moveTo(x + 240, y)
      .lineTo(x + 240, y + 20)
      .stroke()
      .moveTo(x + 300, y)
      .lineTo(x + 300, y + 20)
      .stroke()
      .moveTo(x, y + 20)
      .lineTo(x + 300, y + 20)
      .stroke();
  }
  async generateFooterBr(
    doc,
    name: String,
    room: String,
    date: String,
    seatNumber: String,
    barcode: String,
    Writing: Boolean,
    Version: String,
  ) {
    doc.y = 630;
    doc.x = 40;

    doc
      .fillColor('#000000')
      .rect(10, doc.y, 580, 0.1)

      .fontSize(12)
      .font('Times-Roman')
      .text('Name : ' + name, doc.x, doc.y + 10, { align: 'left', width: 300 })
      .text('Class : ' + room, doc.x, doc.y + 10, { align: 'left', width: 300 })
      .text('Date : ' + date, doc.x, doc.y + 10, { align: 'left', width: 300 });

    if (!Writing)
      doc.text('Seat Number : ' + seatNumber, doc.x, doc.y + 10, {
        align: 'left',
        width: 300,
      });
    if (Version)
      doc
        .font('Times-Bold')
        .moveUp()
        .text(' Version : ' + Version, doc.x, doc.y, {
          align: 'center',
          underline: true,
        });
    doc
      .moveDown()
      .fontSize(10)
      .font('Times-Bold')
      .text(
        'Honor Pledge: “Upon my honor I have neither given nor received aid with this work“',
        { align: 'center', width: 500 },
      )
      .moveDown(0.5)
      .text(
        'Student’s signature : ___________________________________',
        doc.x,
        doc.y + 3,
        { align: 'center', width: 500 },
      )

      .lineJoin('miter')
      .rect(430, 650, 150, 50)
      .stroke();
    var png = await bwipjs.toBuffer({
      bcid: 'code39', // Barcode type
      text: barcode, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: false, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });
    if (png) {
      png.toString('base64');
      doc.image(png, 440, 30, { height: 30, width: 130 }); // in header
      doc.image(png, 440, 660, { height: 30, width: 130 });
    } else {
      console.log(png);
    }
  }
  generateTableFotterBr(doc, x, y) {
    doc
      .fontSize(12)
      .lineTo(x, y + 40)
      .stroke()
      .moveTo(x + 60, y)
      .lineTo(x + 60, y + 40)
      .stroke()

      .text('Exam Total', x + 2, y + 7, { width: 50, align: 'center' })

      .moveTo(x + 120, y)
      .lineTo(x + 120, y + 40)
      .stroke()
      .moveTo(x + 180, y)
      .lineTo(x + 180, y + 40)
      .stroke()
      .moveTo(x + 300, y)
      .lineTo(x + 300, y + 40)
      .stroke()
      .moveTo(x, y)
      .lineTo(x, y + 40)
      .stroke()

      .text('%', x + 242, y + 15, { width: 80, align: 'center' })
      .rect(x, y + 40, x + 20, 1);
  }

  generateEnglishWritingHeader(doc, Grade: string, Version: string) {
    doc
      .image('assetss/nis_logo.png', 20, 10, { width: 65 })
      .moveTo(430, 20)
      .lineTo(430, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(580, 70)
      .lineTo(580, 20)
      .stroke()
      .moveTo(580, 20)
      .lineTo(430, 20)
      .stroke()

      .fillColor('#000000')
      .fontSize(12)
      // .font('assetss/copperplate_gothic_bold_regular.ttf')

      .font('assetss/Times_New_Roman/bold_italic.ttf')
      .moveDown(1.5)
      .text('From the', { align: 'center' })
      .font('assetss/Times_New_Roman/bold.ttf')
      .fontSize(14)
      .text('Office of the Examination Center', { align: 'center' })

      .moveDown(1)
      .fontSize(11)
      .font('assetss/Times_New_Roman/normal.ttf')
      .text('English Writing Assessment', 100, 75)
      .text('Academic Year 2023/2024', 450, 75)

      .moveDown(1)
      .fontSize(14)
      .font('assetss/Times_New_Roman/bold.ttf')
      .text('Grade : ' + Grade, 150, 100)
      .text('Version : ' + Version, 350, 100);
  }

  generateEnglishWritingBody(doc) {
    doc
      .fontSize(16)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('Section One [Multiple Choice Questions]', 20, 120)

      .fontSize(14)
      .font('assetss/Times_New_Roman/bold.ttf')
      .text('1. ________  2. ________  3. ________', 20, 140)

      .fontSize(16)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('Section Two [Writing]', 20, 170)

      .fillColor('grey')
      .text('_______________________')
      .moveDown(0.7)
      .text('_______________________')
      .moveDown(0.7)
      .text('_______________________')
      .moveDown(0.7)
      .text('_______________________')
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '______________________________________________________________________',
      )

      // outer lines
      .moveTo(400, 150)
      .lineTo(400, 210)
      .stroke()
      .moveTo(400, 210)

      .lineTo(550, 210)
      .stroke()
      .moveTo(400, 210)

      .lineTo(550, 210)
      .stroke()
      .moveTo(550, 210)

      .lineTo(550, 150)
      .stroke()
      .moveTo(550, 150)

      .lineTo(400, 150)
      .stroke()

      /// inner horizontal lines
      .moveTo(400, 170)
      .lineTo(550, 170)
      .stroke()

      .moveTo(400, 190)
      .lineTo(550, 190)
      .stroke()

      /// inner Vertical lines
      .moveTo(480, 150)
      .lineTo(480, 210)
      .stroke()

      .moveTo(515, 150)
      .lineTo(515, 210)
      .stroke()

      .fillColor('black')
      .fontSize(16)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('S1', 402, 153)
      .fontSize(16)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('S2', 402, 173)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('Total', 402, 193)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('15', 515, 193);
  }

  async generataEnglishWritingFooter(
    doc,
    classRoom,
    date,
    version,
    name,
    barcode,
  ) {
    doc.y = 720;
    doc.x = 10;
    const y = doc.y;

    doc
      .font('Times-Roman')
      .text('Name : ' + name, doc.x + 10, doc.y + 10)
      .text('Class : ' + classRoom, doc.x, y + 30)
      .text('Date : ' + date, doc.x + 120, y + 30)
      .text('Version : ' + version, doc.x + 180, y + 30)
      // start line
      .moveTo(10, y)
      .lineTo(600, y)
      .stroke()

      .moveTo(430, y + 10)
      .lineTo(580, y + 10)
      .lineTo(580, y + 60)
      .lineTo(430, y + 60)
      .lineTo(430, y + 10)
      .stroke();

    console.log('start ' + barcode);
    //barcode

    var png = await bwipjs.toBuffer({
      bcid: 'code39', // Barcode type
      text: barcode, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: false, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });
    if (png) {
      png.toString('base64');
      doc.image(png, 440, 30, { height: 30, width: 130 }); // in header
      doc.image(png, 440, 740, { height: 30, width: 130 });
    } else {
      console.log(png);
    }
  }

  generateEnglishSocialStudiesHeader(
    doc,
    Grade: string,
    Version: string,
    barcode: string,
  ) {
    doc
      .image('assetss/nis_logo.png', 20, 10, { width: 65 })
      .moveTo(430, 20)
      .lineTo(430, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(430, 70)
      .lineTo(580, 70)
      .stroke()
      .moveTo(580, 70)
      .lineTo(580, 20)
      .stroke()
      .moveTo(580, 20)
      .lineTo(430, 20)
      .stroke()

      .fillColor('#000000')
      .fontSize(12)
      // .font('assetss/copperplate_gothic_bold_regular.ttf')

      .font('assetss/Times_New_Roman/bold_italic.ttf')
      .moveDown(1.5)
      .fontSize(12)
      .text('From the', { align: 'center' })
      .font('assetss/Times_New_Roman/bold.ttf')
      .fontSize(14)
      .text('Office of the Examination Center', { align: 'center' })

      .moveDown(1)
      .fontSize(11)
      .font('assetss/Times_New_Roman/bold.ttf')
      .text('English Social Studies', 100, 75)
      .text('Writing Assessment', 250, 75)
      .text('Academic Year 2023/2024', 450, 75)

      .moveDown(1)
      .fontSize(12)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text(Grade, 150, 100)
      .text('Version ' + Version, 320, 100)

      // outer lines
      .moveTo(450, 100)
      .lineTo(450, 120)
      .lineTo(550, 120)
      .lineTo(550, 100)
      .lineTo(450, 100)
      .stroke()

      /// inner Vertical lines
      .moveTo(490, 100)
      .lineTo(490, 120)
      .stroke()

      .fillColor('black')
      .fontSize(11)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('Total', 452, 103)
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text('_____/25', 495, 103);
  }

  generateEnglishSocialStudiesBody(doc) {
    doc
      .fontSize(12)
      .font('assetss/Times_New_Roman/bold_italic.ttf')
      .text('Important Instructions: ', 20, 120)
      .text(
        'Students have to answer the following questions in full sentences, using correct spelling and punctuation.',
        20,
        140,
      )
      .font('assetss/Times_New_Roman/bold.ttf')

      .text('Question (1)', 20, 170)
      .text('(      / 5)', 500, 170)

      .fillColor('grey')
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.5)

      .fillColor('black')
      .text('Question (2)', 20, doc.y)
      .text('(      / 5)', 500, doc.y)
      .fillColor('grey')
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.5)

      .fillColor('black')
      .text('Question (3)', 20, doc.y)
      .text('(      / 5)', 500, doc.y)
      .fillColor('grey')
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .moveDown(1.3)
      .text(
        '_____________________________________________________________________________________________',
        20,
        doc.y,
      )
      .fillColor('black');
  }

  generateArabicWritingHeader(
    doc,
    Grade: string,
    Version: string,
    barcode: string,
  ) {
    const arr = Grade.split(' ');
    console.log(Grade);
    console.log(arr[1]);

    const customFont = fs.readFileSync(`assetss/Mirza/Mirza-Regular.ttf`);
    doc.registerFont(`SKR-HEAD1`, customFont);
    doc
      .image('assetss/nis_logo.png', 480, 10, { width: 65 })
      .moveTo(30, 20)
      .lineTo(30, 70)
      .stroke()
      .moveTo(30, 70)
      .lineTo(180, 70)
      .stroke()
      .moveTo(30, 70)
      .lineTo(180, 70)
      .stroke()
      .moveTo(180, 70)
      .lineTo(180, 20)
      .stroke()
      .moveTo(180, 20)
      .lineTo(30, 20)
      .stroke()

      .fillColor('#000000')
      .fontSize(12)
      .font('assetss/Times_New_Roman/bold_italic.ttf')
      .moveDown(1.5)
      .text('From the', { align: 'center' })
      .font('assetss/Times_New_Roman/bold.ttf')
      .fontSize(14)
      .text('Office of the Examination Center', { align: 'center' })

      .moveDown(1)
      .fontSize(14)
      .font('SKR-HEAD1')
      .fontSize(14)

      .text('السنة الدراسية', 100, 100, { features: ['rtla'] })
      .text('2023-2024', 30, 100)
      .text(' ( ' + Version + ' ): نموذج', 180, 100)
      .text(arr[1] + ' : الصف', 330, 100)
      .text('المهمة الكتابية', 450, 100, { features: ['rtla'] });
  }

  generateArabicWritingBody(doc) {
    doc
      // outer lines
      .moveTo(20, 120)
      .lineTo(550, 120)
      .stroke()
      .moveTo(550, 120)
      .lineTo(550, 210)
      .stroke()
      .moveTo(550, 210)
      .lineTo(20, 210)
      .stroke()
      .moveTo(20, 210)
      .lineTo(20, 120)
      .stroke()

      ///hotizontal
      .moveTo(540, 125)
      .lineTo(140, 125)
      .stroke()

      .moveTo(540, 145)
      .lineTo(140, 145)
      .stroke()

      .moveTo(540, 165)
      .lineTo(140, 165)
      .stroke()

      .moveTo(540, 185)
      .lineTo(140, 185)
      .stroke()

      .moveTo(540, 205)
      .lineTo(140, 205)
      .stroke()

      /// vertical
      .moveTo(540, 205)
      .lineTo(540, 125)
      .stroke()

      .moveTo(210, 205)
      .lineTo(210, 125)
      .stroke()

      .moveTo(180, 205)
      .lineTo(180, 125)
      .stroke()

      .moveTo(140, 205)
      .lineTo(140, 125)
      .stroke()

      .fillColor('black')
      .text('3', 195, 130)
      .text('3', 195, 150)
      .text('4', 195, 170)
      .text('10', 190, 190)

      .text('أ‌- الأفكار المقدمة وجودة عرضها', 395, 130, { features: ['rtla'] })
      .text('ب- الأدلة المقدمة والتفاصيل الداعمة للأفكار', 345, 150, {
        features: ['rtla'],
      })
      .text('جـ -الدقة اللغوية وصحة استخدام قواعد النحو و الإملاء', 300, 170, {
        features: ['rtla'],
      })
      .text('المجموع', 495, 190, { features: ['rtla'] });

    doc.y = 220;
    doc.x = 20;
    doc
      .moveDown()
      .fillColor('grey')
      .font('assetss/copperplate_gothic_bold_regular.ttf')
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7)
      .text(
        '_________________________________________________________________________________',
      )
      .moveDown(0.7);
  }

  async generataArabicWritingFooter(
    doc,
    classRoom,
    date,
    version,
    name,
    barcode,
  ) {
    doc.y = 720;
    doc.x = 10;
    const y = doc.y;

    doc
      .fillColor('black')
      .font('assetss/SKR-HEAD1.ttf')
      .text('Name : ' + name, doc.x + 10, doc.y + 10)
      .text('Class  : ' + classRoom, doc.x, y + 30)
      .text('Date : ' + date, doc.x + 120, y + 30)
      .text('Version : ' + version, doc.x + 180, y + 30)
      // start line
      .moveTo(10, y)
      .lineTo(600, y)
      .stroke()

      .moveTo(430, y + 10)
      .lineTo(580, y + 10)
      .lineTo(580, y + 60)
      .lineTo(430, y + 60)
      .lineTo(430, y + 10)
      .stroke();

    console.log('start ' + barcode);
    //barcode

    var png = await bwipjs.toBuffer({
      bcid: 'code39', // Barcode type
      text: barcode, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: false, // Show human-readable text
      textxalign: 'center', // Always good to set this
    });
    if (png) {
      png.toString('base64');
      doc.image(png, 40, 30, { height: 30, width: 130 }); // in header
      doc.image(png, 440, 740, { height: 30, width: 130 });
    } else {
      console.log(png);
    }
  }
}
