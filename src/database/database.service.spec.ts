import { Test, TestingModule } from '@nestjs/testing';
import { MasterDatabaseService } from './master.database.service';
import { SlaveDatabaseService } from './slave.database.service';

describe('DatabaseService', () => {
  let masterDatabaseService: MasterDatabaseService;
  let slaveDatabaseService: SlaveDatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MasterDatabaseService],
    }).compile();

    masterDatabaseService = module.get<MasterDatabaseService>(MasterDatabaseService);
    slaveDatabaseService = module.get<SlaveDatabaseService>(SlaveDatabaseService);
  });

  it('master database service should be defined', () => {
    expect(masterDatabaseService).toBeDefined();
  });

  it('slave database service should be defined', () => {
    expect(slaveDatabaseService).toBeDefined();
  });
});
