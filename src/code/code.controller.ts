// src/code/code.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CodeService } from './code.service';
import { ValidateCodeDto } from './dto/validate-code.dto';

@Controller('code')
export class CodeController {
  constructor(private codeService: CodeService) {}

  @Post('validate')
  async validate(@Body() validateCodeDto: ValidateCodeDto) {
    return this.codeService.validateCode(validateCodeDto);
  }
}
