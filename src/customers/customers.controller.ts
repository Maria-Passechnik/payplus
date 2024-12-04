import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  getCustomers() {
    return this.customersService.getAllCustomers();
  }

  // @UseGuards(JwtAuthGuard)
  // @Get(':id')
  // getCustomerById(@Param('id') id: string) {
  //   return this.customersService.getCustomerById(id);
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post()
  // createCustomer(@Body() customerData: { name: string; email: string; }) {
  //   return this.customersService.createCustomer(customerData);
  // }
}
