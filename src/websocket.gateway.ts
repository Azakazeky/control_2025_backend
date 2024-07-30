import { OnModuleInit } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "socket.io";


@WebSocketGateway( 3000, {
    transports: [ 'websocket' ]
} )
export class WebsocketGateway implements OnModuleInit
{
    @WebSocketServer()
    server: Server;

    onModuleInit ()
    {
        this.server.on( 'connection', ( socket ) =>
        {
            console.log( 'connected', socket.id, Date.now() );
        } );
    }


    @SubscribeMessage( 'joinRoom' )
    handleJoinRoom ( client: any, data: { roomId: string; } ): void
    {
        console.log( 'new user joined room', data.roomId );
        client.join( data.roomId );
        this.server.to( data.roomId ).emit( 'newUser', { userId: client.id } );
    }

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
}