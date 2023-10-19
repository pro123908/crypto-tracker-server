import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(): string {
    return 'This action returns all transactions';
  }
}
