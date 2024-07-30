import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { AuthService } from './Component/auth/auth.service';


@WebSocketGateway( 3000, {
    transports: [ 'websocket' ]
} )
export class WebsocketGateway implements OnModuleInit, OnGatewayDisconnect, OnGatewayConnection
{
    constructor ( private authService: AuthService, private jwtService: JwtService ) { }
    private rooms: Map<string, Array<Map<string, any>>[]> = new Map();

    @WebSocketServer()
    server: Server;

    handleDisconnect ( client: Socket )
    {

        console.log( 'Disconnect ', client.id );
    }
    async handleConnection ( client: Socket, ...args: any[] )
    {


        var roomId: any = client.handshake.query.roomid;
        if ( client.handshake.auth.authorization && await this.jwtService.decode( client.handshake.auth.authorization.split( ' ' )[ 1 ] ) )
        {
            var tokenData = await this.jwtService.decode( client.handshake.auth.authorization.split( ' ' )[ 1 ] );
            console.log( tokenData );
            console.log( tokenData.userId );
            client.join( roomId );
            if ( this.rooms.has( roomId ) )
            {
                this.rooms[ roomId ] = this.rooms[ roomId ].push( {
                    'socket_id': client.id,
                    'user_id': tokenData.userId,
                    'type': tokenData.type
                } );
            } else
            {
                this.rooms[ roomId ] = [ {
                    'socket_id': client.id,
                    'user_id': tokenData.userId,
                    'type': tokenData.type
                } ];
            }


            this.server.to( roomId ).emit( 'newUser', this.rooms[ roomId ] );

        }

        console.log( 'connected ', client.id );
    }

    onModuleInit ()
    {
        this.server.on( 'connection', ( socket ) =>
        {
            console.log( 'connected', socket.id, Date.now() );
        } );
    }


    // @SubscribeMessage( 'joinRoom' )
    // async handleJoinRoom ( client: Socket, message: { roomId: string; } )
    // {
    // let auth_token = client.handshake.headers.authorization.split(' ')[1];
    // if (await this.jwtService.decode(client.handshake.headers.authorization.split(' ')[1])) {
    //     var tokenData = await this.jwtService.decode(client.handshake.headers.authorization.split(' ')[1]);
    //     console.log(tokenData);
    //     console.log(tokenData.userId);
    //     console.log('new user joined room', message.roomId);
    //     client.join(message.roomId);
    //     if (this.rooms.has(message.roomId)) {
    //         this.rooms[message.roomId] = this.rooms[message.roomId].push({
    //             'socket_id': client.id,
    //             'user_id': tokenData.userId,
    //             'type': tokenData.type
    //         })
    //     } else {
    //         this.rooms[message.roomId] = [{
    //             'socket_id': client.id,
    //             'user_id': tokenData.userId,
    //             'type': tokenData.type
    //         }];
    //     }


    //     this.server.to(message.roomId).emit('newUser', this.rooms[message.roomId]);

    // }
    // }

    @SubscribeMessage( 'leaveRoom' )
    handleLeaveRoom ( client: any, data: { roomId: string; } ): void
    {
        console.log( 'user left room', data.roomId );
        client.leave( data.roomId );
        this.server.to( data.roomId ).emit( 'userLeft', { userId: client.id } );
    }

    @SubscribeMessage( 'deleteRoom' )
    handleDeleteRoom ( client: any, data: { roomId: string; } ): void
    {
        this.server.socketsLeave( data.roomId );
    }

    @SubscribeMessage( 'onEvent' )
    handleMessage ( client: any, data: { roomId: string; message: string; sender: string; } ): void
    {
        console.log( 'onEvent', data );
        this.server.to( data.roomId ).emit( 'onEvent', { message: data.message, sender: data.sender } );
    }


    @SubscribeMessage( 'onStudent' )
    getStudent ( client: Socket, message: { roomId: string; } ): void
    {
        console.log( message );

        this.server.to( message.roomId ).emit( 'students', this.rooms[ message.roomId ] );
    }








}




/*
1- waiting exam
2- Started exam 
3- chating exam
4- finished exam
*/