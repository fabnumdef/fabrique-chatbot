import { Test, TestingModule } from '@nestjs/testing';
import { RasaService } from './rasa.service';

describe('RasaService', () => {
  let service: RasaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RasaService],
    }).compile();

    service = module.get<RasaService>(RasaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
