import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NATS_SERVICE, envs } from 'src/configs';

@Module({
  imports: [
    ClientsModule.register([
      { name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServer,
        }
      }
    ])
  ],
  exports: [
    ClientsModule.register([
      { name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: envs.natsServer,
        }
      }
    ])
  ]
})
export class NatsModule {}
