import { IsNumber, IsPositive, IsEnum, IsOptional, IsBoolean, IsArray, ArrayMinSize, ValidateNested } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enums/order.enum";
import { ItemOrderDto } from "./item-order.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {

  // @IsNumber()
  // @IsPositive()
  // totalAmount: number;

  // @IsNumber()
  // @IsPositive()
  // totalItems: number;

  // @IsEnum( OrderStatusList, {
  //   message: `Possible status values are ${ OrderStatusList }`
  // })
  // @IsOptional()
  // status: OrderStatus = OrderStatus.PENDING

  // @IsBoolean()
  // @IsOptional()
  // paid: boolean = false;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type( () => ItemOrderDto)
  items: ItemOrderDto[]

}
