import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})


export class EventsGateway {

  @WebSocketServer() server: Server;

  handleConnection(client: Socket, ...args: any[]) {
    // console.log('Hola alguien se conecto al socket');
  }

  handleDisconnect(client: Socket) {
    // console.log('ALguien se fue! chao chao')
  }

  @SubscribeMessage('join-user')
  handleJoinUser(client: Socket, payload: {user_id:number, group:any}[]){
    
    payload[0].group.forEach((element:any) => {
      client.join(element.id);
    });

    client.join(payload[0].user_id.toString());
    
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, @MessageBody() data: {message:string, message_id: number, user_from:number, user_to:number}[]) {
    this.server.to(data[0].user_to.toString()).emit('aswner-message', data);
  }

  @SubscribeMessage('message-group')
  handleMessageGroup(client: Socket, @MessageBody() data: {message:string, message_id: number ,user_from: any, group_to:string}[]) {
    this.server.to(data[0].group_to).emit('aswner-message-group', data);
  }

}
