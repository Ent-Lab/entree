import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class UsefulService {
  async genCode(): Promise<string> {
    try {
      const uuid = () => {
        const tokens = v4().split('-');
        return tokens[2] + tokens[1] + tokens[0] + tokens[3] + tokens[4];
      };

      return uuid();
    } catch (error) {
      throw error;
    }
  }
}
