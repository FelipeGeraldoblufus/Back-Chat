import { Module } from '@nestjs/common';
import { ChatGatewaySala1 } from './chat/chat.gateway.sala1';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  imports: [AuthModule],
  providers: [ChatGatewaySala1]
})
export class ChatModule {}
