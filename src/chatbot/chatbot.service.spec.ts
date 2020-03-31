import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { Repository } from "typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
const XLSX = require('xlsx');
import cloneDeep = require('lodash/cloneDeep');
import { chatbotsMock } from "@mock/chatbots.mock";

describe('ChatbotService', () => {
  let chatbotService: ChatbotService;
  let chatbotRepository: Repository<Chatbot>;
  let workbook: any;

  const chatbots: Chatbot[] = cloneDeep(chatbotsMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        {provide: getRepositoryToken(Chatbot), useClass: Repository}
      ],
    }).compile();

    chatbotService = module.get<ChatbotService>(ChatbotService);
    chatbotRepository = module.get<Repository<Chatbot>>(getRepositoryToken(Chatbot));
  });

  it('should be defined', () => {
    expect(chatbotService).toBeDefined();
  });

  describe('repository calls', () => {
    it('should call find when findAll', async () => {
      jest.spyOn(chatbotRepository, 'find').mockResolvedValueOnce(chatbots);
      expect(await chatbotService.findAll()).toEqual(chatbots);
    });

    it('should call create', async () => {
      jest.spyOn(chatbotRepository, 'save').mockResolvedValueOnce(chatbots[0]);
      await chatbotService.create(chatbots[0]);
      expect(chatbotRepository.save).toHaveBeenCalledWith(chatbots[0]);
    });
  });

  describe('Check template file', () => {
    beforeEach(async () => {
      workbook = await XLSX.readFile('./test/files/TEMPLATE_CHATBOT_TEST.xlsx');
    });

    it('should throw exception if file is not an excel', async () => {
      expect(() => {chatbotService.checkTemplateFile(null)}).toThrow();
    });

    it('should convert template file to json', async () => {
      // @ts-ignore
      jest.spyOn(chatbotService._xlsx, 'read').mockReturnValue(workbook);
      // @ts-ignore
      jest.spyOn(chatbotService, 'computeTemplateFile').mockReturnValue(null);
      // @ts-ignore
      jest.spyOn(chatbotService, 'checkFile').mockReturnValue(null);

      const result = chatbotService.checkTemplateFile({});
      expect(result).toBeDefined();
    });

    it('should compute template file', async () => {
      // @ts-ignore
      jest.spyOn(chatbotService._xlsx, 'read').mockReturnValue(workbook);
      // @ts-ignore
      jest.spyOn(chatbotService, 'checkFile').mockReturnValue(null);

      const result = chatbotService.checkTemplateFile({});
      expect(result.categories.length).toEqual(2);
      expect(result.questionsNumber).toEqual(12);
    });

    it('should check file', async () => {
      // @ts-ignore
      jest.spyOn(chatbotService._xlsx, 'read').mockReturnValue(workbook);

      const result = chatbotService.checkTemplateFile({});
      expect(Object.keys(result.warnings).length).toBeGreaterThan(0);
      expect(Object.keys(result.errors).length).toBeGreaterThan(0);
    });
  });

  describe('File filers', () => {
    it('should return an error if it is not an excel', async () => {
      expect(ChatbotService.excelFileFilter(null, {originalname: 'test.doc'}, (error, success) => error)).toBeDefined();
      expect(ChatbotService.excelFileFilter(null, {originalname: 'xls.doc'}, (error, success) => error)).toBeDefined();
      expect(ChatbotService.excelFileFilter(null, {originalname: 'xlsx.doc'}, (error, success) => error)).toBeDefined();
    });

    it('should return true if it is an excel', async () => {
      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xlsx'}, (error, success) => error)).toEqual(null);
      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xls'}, (error, success) => error)).toEqual(null);

      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xlsx'}, (error, success) => success)).toEqual(true);
      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xls'}, (error, success) => success)).toEqual(true);
    });
  });


  describe('Image filers', () => {
    it('should return an error if it is not an jpg or png', async () => {
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'image.gif'}, (error, success) => error)).toBeDefined();
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'jpg.doc'}, (error, success) => error)).toBeDefined();
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'png.doc'}, (error, success) => error)).toBeDefined();
    });

    it('should return true if it is an image', async () => {
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.jpg'}, (error, success) => error)).toEqual(null);
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.png'}, (error, success) => error)).toEqual(null);

      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.jpg'}, (error, success) => success)).toEqual(true);
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.png'}, (error, success) => success)).toEqual(true);
    });
  });
});
