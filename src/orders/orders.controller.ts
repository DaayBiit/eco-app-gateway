import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { StatusOrderDto } from './dto/status-order.dto';
import { PaginationOrderDto } from './dto/pagination-order.dto';
import { NATS_SERVICE } from 'src/configs';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy
  ) {}

  @Post()
  createProduct(@Body() createOrderDto: CreateOrderDto){
    return this.client.send('createOrder', createOrderDto)

  }

  @Get()
  async findAll(@Query() paginationOrderDto: PaginationOrderDto) {
    // return this.client.send('findAllOrders', paginationOrderDto)
    //   .pipe( catchError( err => { throw new RpcException(err)}));
    // 
    try {
      return await firstValueFrom(
        this.client.send('findAllOrders', paginationOrderDto)
      );
    } catch (error) {
      throw new RpcException(error)
    }

  }

  @Get('/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
  
    // return this.client.send('findOneOrder', {id})
    //   .pipe( catchError( err => { throw new RpcException(err)}));

    try {
      return await firstValueFrom(
        this.client.send('findOneOrder', {id})
      );
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get('/status')
  async findAllByStatus(
    @Param() statusDto: StatusOrderDto,
    @Query() paginationOrderDto: PaginationOrderDto,
  ) {
    try {

      return this.client.send('findAllOrders', {
        ...paginationOrderDto,
        status: statusDto.status,
      });

    } catch (error) {
      throw new RpcException(error);
    }
  }


  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe ) id: string,
    @Body() statusOrderDto: StatusOrderDto,
  ) {
    try {
      return this.client.send('changeOrderStatus', { id, status: statusOrderDto.status })
    } catch (error) {
      throw new RpcException(error);
    }
  }

}
