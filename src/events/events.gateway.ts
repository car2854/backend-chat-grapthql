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
  handleJoinUser(client: Socket, payload: {user_id:number}[]){
    
    client.join(payload[0].user_id.toString());
    
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, @MessageBody() data: {message:string, user_from:number, user_to:number}[]) {


    this.server.to(data[0].user_to.toString()).emit('message', data);

  }

}
