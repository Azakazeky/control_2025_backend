-- CreateTable
CREATE TABLE `class_desk` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `School_Class_ID` INTEGER NOT NULL,
    `Cloumn_Num` INTEGER NOT NULL,
    `Row_Num` INTEGER NOT NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    INDEX `fk_Class_Desk_School_Class1_idx`(`School_Class_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cohort` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `School_Type_ID` INTEGER NOT NULL,
    `Name` VARCHAR(45) NOT NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Name_UNIQUE`(`Name`),
    INDEX `fk_Cohort_School_Type1_idx`(`School_Type_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cohort_has_subjects` (
    `Cohort_ID` INTEGER NOT NULL,
    `Subjects_ID` INTEGER NOT NULL,

    INDEX `fk_Cohort_has_Subjects_Cohort1_idx`(`Cohort_ID`),
    INDEX `fk_Cohort_has_Subjects_Subjects1_idx`(`Subjects_ID`),
    PRIMARY KEY (`Cohort_ID`, `Subjects_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `control_mission` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Education_year_ID` INTEGER NOT NULL,
    `Schools_ID` INTEGER NOT NULL,
    `Name` VARCHAR(45) NOT NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    INDEX `fk_Control_Mission_Education_year1_idx`(`Education_year_ID`),
    INDEX `fk_Control_Mission_Schools1_idx`(`Schools_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `education_year` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Name_UNIQUE`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_mission` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Subjects_ID` INTEGER NOT NULL,
    `Control_Mission_ID` INTEGER NOT NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    INDEX `fk_Subjects_has_Control_Mission_Control_Mission1_idx`(`Control_Mission_ID`),
    INDEX `fk_Subjects_has_Control_Mission_Subjects1_idx`(`Subjects_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_room` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Control_Mission_ID` INTEGER NOT NULL,
    `School_Class_ID` INTEGER NOT NULL,
    `Name` VARCHAR(45) NOT NULL,
    `Stage` VARCHAR(45) NOT NULL,
    `Capacity` INTEGER NOT NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    INDEX `fk_Exam_Room_Control_Mission1_idx`(`Control_Mission_ID`),
    INDEX `fk_Exam_Room_School_Class1_idx`(`School_Class_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grades` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Schools_ID` INTEGER NOT NULL,
    `Name` VARCHAR(45) NOT NULL,
    `Next_Grade` INTEGER NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Name_UNIQUE`(`Name`),
    INDEX `fk_Grades_Schools1_idx`(`Schools_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Name_UNIQUE`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles_has_screens` (
    `Roles_ID` INTEGER NOT NULL,
    `Screens_ID` INTEGER NOT NULL,

    INDEX `fk_Roles_has_Screens_Roles1_idx`(`Roles_ID`),
    INDEX `fk_Roles_has_Screens_Screens1_idx`(`Screens_ID`),
    PRIMARY KEY (`Roles_ID`, `Screens_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_class` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Schools_ID` INTEGER NOT NULL,
    `Name` VARCHAR(45) NOT NULL,
    `Max_Capacity` VARCHAR(45) NOT NULL DEFAULT '30',
    `Floor` VARCHAR(45) NOT NULL DEFAULT '0',
    `Rows` VARCHAR(45) NOT NULL DEFAULT '[6,6,6,6,6]',
    `Columns` INTEGER NOT NULL DEFAULT 5,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    INDEX `fk_School_Class_Schools_idx`(`Schools_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_type` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(45) NOT NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Name_UNIQUE`(`Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schools` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `School_Type_ID` INTEGER NOT NULL,
    `Name` VARCHAR(100) NOT NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Name_UNIQUE`(`Name`),
    INDEX `fk_Schools_School_Type1_idx`(`School_Type_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `screens` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(45) NOT NULL,
    `Front_Id` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Front_Id_UNIQUE`(`Front_Id`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Grades_ID` INTEGER NOT NULL,
    `Schools_ID` INTEGER NOT NULL,
    `Cohort_ID` INTEGER NOT NULL,
    `School_Class_ID` INTEGER NOT NULL,
    `First_Name` VARCHAR(45) NOT NULL,
    `Second_Name` VARCHAR(45) NOT NULL,
    `Third_Name` VARCHAR(45) NOT NULL,
    `Email` VARCHAR(45) NULL,
    `Second_Lang` VARCHAR(45) NULL,
    `Studentcol` INTEGER NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    INDEX `fk_Student_Cohort1_idx`(`Cohort_ID`),
    INDEX `fk_Student_Grades1_idx`(`Grades_ID`),
    INDEX `fk_Student_School_Class1_idx`(`School_Class_ID`),
    INDEX `fk_Student_Schools1_idx`(`Schools_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_barcode` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Exam_Mission_ID` INTEGER NOT NULL,
    `Student_ID` INTEGER NOT NULL,
    `Barcode` VARCHAR(45) NOT NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `Barcode_UNIQUE`(`Barcode`),
    INDEX `fk_Exam_Mission_has_Student_Exam_Mission1_idx`(`Exam_Mission_ID`),
    INDEX `fk_Exam_Mission_has_Student_Student1_idx`(`Student_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_seat_numnbers` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Exam_Room_ID` INTEGER NOT NULL,
    `Student_ID` INTEGER NOT NULL,
    `Control_Mission_ID` INTEGER NOT NULL,
    `Seat_Number` VARCHAR(6) NOT NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    INDEX `fk_Exam_Room_has_Student_Exam_Room1_idx`(`Exam_Room_ID`),
    INDEX `fk_Exam_Room_has_Student_Student1_idx`(`Student_ID`),
    INDEX `fk_Student_Seat_Numnbers_Control_Mission1_idx`(`Control_Mission_ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(45) NOT NULL,
    `Active` VARCHAR(45) NOT NULL DEFAULT '1',
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active_copy1` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_logger` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `TableName` VARCHAR(45) NOT NULL,
    `Action` VARCHAR(45) NOT NULL,
    `UserId` VARCHAR(45) NOT NULL,
    `Date` VARCHAR(45) NOT NULL,
    `Record_Befor` VARCHAR(45) NULL,
    `Record_After` VARCHAR(45) NULL,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Full_Name` TEXT NOT NULL,
    `User_Name` VARCHAR(45) NOT NULL,
    `Password` VARCHAR(45) NOT NULL,
    `Created_By` INTEGER NULL,
    `Created_At` VARCHAR(45) NULL,
    `Updated_By` VARCHAR(45) NULL,
    `Updated_At` VARCHAR(45) NULL,
    `Active` TINYINT NOT NULL DEFAULT 1,

    UNIQUE INDEX `ID_UNIQUE`(`ID`),
    UNIQUE INDEX `User_Name_UNIQUE`(`User_Name`),
    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_has_roles` (
    `Users_ID` INTEGER NOT NULL,
    `Roles_ID` INTEGER NOT NULL,

    INDEX `fk_Users_has_Roles_Roles1_idx`(`Roles_ID`),
    INDEX `fk_Users_has_Roles_Users1_idx`(`Users_ID`),
    PRIMARY KEY (`Users_ID`, `Roles_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_has_schools` (
    `Users_ID` INTEGER NOT NULL,
    `Schools_ID` INTEGER NOT NULL,

    INDEX `fk_Users_has_Schools_Schools1_idx`(`Schools_ID`),
    INDEX `fk_Users_has_Schools_Users1_idx`(`Users_ID`),
    PRIMARY KEY (`Users_ID`, `Schools_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `class_desk` ADD CONSTRAINT `fk_Class_Desk_School_Class1` FOREIGN KEY (`School_Class_ID`) REFERENCES `school_class`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cohort` ADD CONSTRAINT `fk_Cohort_School_Type1` FOREIGN KEY (`School_Type_ID`) REFERENCES `school_type`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cohort_has_subjects` ADD CONSTRAINT `fk_Cohort_has_Subjects_Cohort1` FOREIGN KEY (`Cohort_ID`) REFERENCES `cohort`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cohort_has_subjects` ADD CONSTRAINT `fk_Cohort_has_Subjects_Subjects1` FOREIGN KEY (`Subjects_ID`) REFERENCES `subjects`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `control_mission` ADD CONSTRAINT `fk_Control_Mission_Education_year1` FOREIGN KEY (`Education_year_ID`) REFERENCES `education_year`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `control_mission` ADD CONSTRAINT `fk_Control_Mission_Schools1` FOREIGN KEY (`Schools_ID`) REFERENCES `schools`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `exam_mission` ADD CONSTRAINT `fk_Subjects_has_Control_Mission_Control_Mission1` FOREIGN KEY (`Control_Mission_ID`) REFERENCES `control_mission`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `exam_mission` ADD CONSTRAINT `fk_Subjects_has_Control_Mission_Subjects1` FOREIGN KEY (`Subjects_ID`) REFERENCES `subjects`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `exam_room` ADD CONSTRAINT `fk_Exam_Room_Control_Mission1` FOREIGN KEY (`Control_Mission_ID`) REFERENCES `control_mission`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `exam_room` ADD CONSTRAINT `fk_Exam_Room_School_Class1` FOREIGN KEY (`School_Class_ID`) REFERENCES `school_class`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `grades` ADD CONSTRAINT `fk_Grades_Schools1` FOREIGN KEY (`Schools_ID`) REFERENCES `schools`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles_has_screens` ADD CONSTRAINT `fk_Roles_has_Screens_Roles1` FOREIGN KEY (`Roles_ID`) REFERENCES `roles`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles_has_screens` ADD CONSTRAINT `fk_Roles_has_Screens_Screens1` FOREIGN KEY (`Screens_ID`) REFERENCES `screens`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `school_class` ADD CONSTRAINT `fk_School_Class_Schools` FOREIGN KEY (`Schools_ID`) REFERENCES `schools`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `fk_Schools_School_Type1` FOREIGN KEY (`School_Type_ID`) REFERENCES `school_type`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `fk_Student_Cohort1` FOREIGN KEY (`Cohort_ID`) REFERENCES `cohort`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `fk_Student_Grades1` FOREIGN KEY (`Grades_ID`) REFERENCES `grades`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `fk_Student_School_Class1` FOREIGN KEY (`School_Class_ID`) REFERENCES `school_class`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `fk_Student_Schools1` FOREIGN KEY (`Schools_ID`) REFERENCES `schools`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student_barcode` ADD CONSTRAINT `fk_Exam_Mission_has_Student_Exam_Mission1` FOREIGN KEY (`Exam_Mission_ID`) REFERENCES `exam_mission`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student_barcode` ADD CONSTRAINT `fk_Exam_Mission_has_Student_Student1` FOREIGN KEY (`Student_ID`) REFERENCES `student`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student_seat_numnbers` ADD CONSTRAINT `fk_Exam_Room_has_Student_Exam_Room1` FOREIGN KEY (`Exam_Room_ID`) REFERENCES `exam_room`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student_seat_numnbers` ADD CONSTRAINT `fk_Exam_Room_has_Student_Student1` FOREIGN KEY (`Student_ID`) REFERENCES `student`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `student_seat_numnbers` ADD CONSTRAINT `fk_Student_Seat_Numnbers_Control_Mission1` FOREIGN KEY (`Control_Mission_ID`) REFERENCES `control_mission`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_has_roles` ADD CONSTRAINT `fk_Users_has_Roles_Roles1` FOREIGN KEY (`Roles_ID`) REFERENCES `roles`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_has_roles` ADD CONSTRAINT `fk_Users_has_Roles_Users1` FOREIGN KEY (`Users_ID`) REFERENCES `users`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_has_schools` ADD CONSTRAINT `fk_Users_has_Schools_Schools1` FOREIGN KEY (`Schools_ID`) REFERENCES `schools`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users_has_schools` ADD CONSTRAINT `fk_Users_has_Schools_Users1` FOREIGN KEY (`Users_ID`) REFERENCES `users`(`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
