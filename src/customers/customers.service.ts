import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomersService {
  getAllCustomers() {
    return [
      { id: 1, name: 'Customer A', email: 'a@example.com' },
      { id: 2, name: 'Customer B', email: 'b@example.com' },
    ];
  }

  // getCustomerById(id: string) {
  //   const customer = this.customers.find((customer) => customer.id === id);
  //   if (!customer) {
  //     throw new Error(`Customer with ID ${id} not found`);
  //   }
  //   return customer;
  // }

  // createCustomer(customerData: { name: string; email: string }) {
  //   const newCustomer = {
  //     id: (this.customers.length + 1).toString(),
  //     ...customerData,
  //   };
  //   this.customers.push(newCustomer);
  //   return newCustomer;
  // }
}
