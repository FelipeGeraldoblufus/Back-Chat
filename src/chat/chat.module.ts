import { Module } from '@nestjs/common';
import { ChatGatewaySala1 } from './chat/chat.gateway.sala1';
import { AuthModule } from 'src/auth/auth.module';
import { ChatGatewaySala2 } from './chat/chat.gateway.sala2';
import { ChatGatewaySala3 } from './chat/chat.gateway.sala3';


@Module({
  imports: [AuthModule],
  providers: [ChatGatewaySala1,ChatGatewaySala2,ChatGatewaySala3]
})
export class ChatModule {}
