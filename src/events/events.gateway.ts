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
    client.emit('id-section', client.id);
  }

  handleDisconnect(client: Socket) {
    // console.log('ALguien se fue! chao chao')
  }

  @SubscribeMessage('join-user')
  handleJoinUser(client: Socket, payload: {user_id:number, group:any}[]){
    
    payload[0].group.forEach((element:any) => {
      client.join(element.id);
    });

    // client.join(payload[0].user_id.toString());    
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, @MessageBody() payload: {message:string, message_id: number, user_from:number, user_to:any}[]) {
    console.log(payload);
    const {user_to, ...data} = payload[0];
    this.server.to(user_to.id_section).emit('aswner-message', payload);
    this.server.to(user_to.id_section).emit('notification', payload);
  }

  @SubscribeMessage('message-group')
  handleMessageGroup(client: Socket, @MessageBody() payload: {message:string, message_id: number ,user_from: any, group_to:string}[]) {
    this.server.to(payload[0].group_to).emit('aswner-message-group', payload);
    this.server.to(payload[0].group_to).emit('notification', payload);
  }

}
