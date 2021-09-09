/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiConfigService } from '../api-config/api-config.service';
import { UsersService } from './users.service';

@Controller('registration')
export class RegistrationController {
  constructor(
    private readonly config: ApiConfigService,
    private readonly usersService: UsersService,
  ) {}

  @Get(':token/confirm')
  async confirm(
    @Param('token') token: string,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.usersService.findByConfirmationToken(token);
    if (!user || user.confirmed_at) {
      throw new NotFoundException();
    }
    await this.usersService.confirm(user);
    res.redirect(
      `${this.config.get<string>(
        'INCENTIVIZED_TESTNET_URL',
      )}/login?confirmed=true`,
    );
  }
}
