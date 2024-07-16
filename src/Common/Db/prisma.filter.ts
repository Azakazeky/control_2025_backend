
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

@Catch( PrismaClientKnownRequestError )
export class PrismaExceptionFilter implements ExceptionFilter
{

  catch ( exception: PrismaClientKnownRequestError, host: ArgumentsHost )
  {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.code;

    switch ( status )
    {

      case "P1003":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Database {database_file_name} does not exist at {database_file_path}"
          } );
      case "P1008":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "TimeOut from database server"
          } );

      case "P1010":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "User was denied access on the database"
          } );
      case "P1012":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Argument is missing"
          } );


      case "P1016":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Your raw query had an incorrect number of parameters"
          } );

      case "P1017":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Server has closed the connection."
          } );


      case "P2000":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "The provided value for the column is too long for the column's type."
          } );


      case "P2001":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "The record searched for in the where condition does not exist"
          } );

      case "P2002":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "This value violates an existing unique constraint on the field: " + exception.meta.field_name
          } );


      case "P2003":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "This value already exists for the field " + exception.meta.field_name,
          } );


      case "P2004":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Foreign key constraint failed on the field " + exception.meta.field_name,
          } );

      case "P2005":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "The value  stored in the database for the field  is invalid for the field's type" + exception.meta.field_name,
          } );



      case "P2006":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "The provided value is not valid" + exception.meta.field_name,
          } );

      case "P2007":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Data validation errors" + exception.meta.field_name,
          } );
      case "P2011":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Null constraint violation on the " + exception.meta.constraint,
          } );
      case "P2013":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Missing the required argument " + exception.meta.argument_name + " for field " + exception.meta.field_name + ' in tabale ' + exception.meta.object_name,
          } );
      case "P2015":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "A related record could not be found" + exception.meta.details,
          } );


      case "P2020":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Value out of range for the type " + exception.meta.details,
          } );

      case "P2027":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Multiple errors occurred on the database during query execution " + exception.meta.errors,
          } );

      case "P2033":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers",
          } );
      case "P2025":
        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: "Record to update not found",
          } );

      default:

        return response
          .status( 500 )
          .send( {
            status: false,
            // timestamp: new Date().toISOString(),
            message: exception.message + " =>meta:::" + exception.meta,
          } );
    }

  }
}