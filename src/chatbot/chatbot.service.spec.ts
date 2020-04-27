import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from './chatbot.service';
import { Repository } from "typeorm";
import { Chatbot } from "@entity/chatbot.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
const XLSX = require('xlsx');
import cloneDeep = require('lodash/cloneDeep');
import { chatbotsMock } from "@mock/chatbots.mock";
import { OvhStorageService } from "../shared/services/ovh-storage.service";
import { FileModel } from "@model/file.model";
import { ovhStorageServiceStub } from "../../test/stubs/ovh-storage.service.stub";

describe('ChatbotService', () => {
  let chatbotService: ChatbotService;
  let ovhStorageService: OvhStorageService;
  let chatbotRepository: Repository<Chatbot>;
  let workbook: any;

  const chatbots: Chatbot[] = cloneDeep(chatbotsMock);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        {provide: getRepositoryToken(Chatbot), useClass: Repository},
        {provide: OvhStorageService, useValue: ovhStorageServiceStub},
      ],
    }).compile();

    chatbotService = module.get<ChatbotService>(ChatbotService);
    chatbotRepository = module.get<Repository<Chatbot>>(getRepositoryToken(Chatbot));
    ovhStorageService = module.get<OvhStorageService>(OvhStorageService);
  });

  it('should be defined', () => {
    expect(chatbotService).toBeDefined();
  });

  describe('repository calls', () => {
    it('should call find when findAll', async () => {
      jest.spyOn(chatbotRepository, 'find').mockResolvedValueOnce(chatbots);
      expect(await chatbotService.findAll()).toEqual(chatbots);
    });

    it('should call findOne when findOne', async () => {
      jest.spyOn(chatbotRepository, 'findOne').mockResolvedValueOnce(chatbots[0]);
      expect(await chatbotService.findOne(chatbots[0].id)).toEqual(chatbots[0]);
    });

    it('should call findOne when findOneWithParam', async () => {
      jest.spyOn(chatbotRepository, 'findOne').mockResolvedValueOnce(chatbots[0]);
      expect(await chatbotService.findOneWithParam(chatbots[0].id)).toEqual(chatbots[0]);
    });

    it('should call create', async () => {
      jest.spyOn(chatbotRepository, 'save').mockResolvedValueOnce(chatbots[0]);
      await chatbotService.create(chatbots[0]);
      expect(chatbotRepository.save).toHaveBeenCalledWith(chatbots[0]);
    });

    it('should not call save when no file or no icon', async () => {
      jest.spyOn(chatbotRepository, 'save').mockResolvedValue(chatbots[0]);
      await chatbotService.create(chatbots[0], <FileModel> {});
      expect(chatbotRepository.save).toHaveBeenCalledTimes(1);

      await chatbotService.create(chatbots[0], null, <FileModel> {});
      expect(chatbotRepository.save).toHaveBeenCalledTimes(2);
    });


    it('should call save two time and ovh storage service when file & icon', async () => {
      jest.spyOn(chatbotRepository, 'save').mockResolvedValue(chatbots[0]);
      jest.spyOn(ovhStorageService, 'set').mockResolvedValue(true);

      await chatbotService.create(chatbots[0], <FileModel> {originalname: 'file.xlsx'}, <FileModel> {originalname: 'icon.png'});
      expect(chatbotRepository.save).toHaveBeenCalledTimes(2);
      expect(ovhStorageService.set).toHaveBeenCalledTimes(2);
    });

    it('should call save and update if the chatbot exists', async () => {
      jest.spyOn(chatbotRepository, 'findOne').mockResolvedValueOnce(chatbots[0]);
      jest.spyOn(chatbotRepository, 'save').mockResolvedValueOnce(chatbots[0]);

      await chatbotService.findAndUpdate(chatbots[0].id, {primary_color: '#000'});
      expect(chatbotRepository.findOne).toHaveBeenCalled();
      const chatbotUptaded = cloneDeep(chatbots[0]);
      chatbotUptaded.primary_color = '#000';
      expect(chatbotRepository.save).toHaveBeenCalledWith(chatbotUptaded);
    });

    it('should throw an error on save and update if the chatbot doest not exists', async () => {
      jest.spyOn(chatbotRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(chatbotRepository, 'save').mockResolvedValueOnce(chatbots[0]);

      await expect(chatbotService.findAndUpdate(chatbots[0].id, {primary_color: '#000'})).rejects.toBeTruthy();
      expect(chatbotRepository.save).not.toHaveBeenCalled();
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
      jest.spyOn(chatbotService, '_computeTemplateFile').mockReturnValue(null);
      // @ts-ignore
      jest.spyOn(chatbotService, '_checkFile').mockReturnValue(null);

      const result = chatbotService.checkTemplateFile({});
      expect(result).toBeDefined();
    });

    it('should compute template file', async () => {
      // @ts-ignore
      jest.spyOn(chatbotService._xlsx, 'read').mockReturnValue(workbook);
      // @ts-ignore
      jest.spyOn(chatbotService, '_checkFile').mockReturnValue(null);

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

      expect(ChatbotService.multipleFileFilters(null, {originalname: 'xlsx.doc', fieldname: 'file'}, (error, success) => error)).toBeDefined();
    });

    it('should return true if it is an excel', async () => {
      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xlsx'}, (error, success) => error)).toEqual(null);
      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xls'}, (error, success) => error)).toEqual(null);

      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xlsx'}, (error, success) => success)).toEqual(true);
      expect(ChatbotService.excelFileFilter(null, {originalname: 'doc.xls'}, (error, success) => success)).toEqual(true);

      expect(ChatbotService.multipleFileFilters(null, {originalname: 'doc.xls', fieldname: 'file'}, (error, success) => success)).toEqual(true);
    });
  });


  describe('Image filers', () => {
    it('should return an error if it is not an jpg or png', async () => {
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'image.gif'}, (error, success) => error)).toBeDefined();
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'jpg.doc'}, (error, success) => error)).toBeDefined();
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'png.doc'}, (error, success) => error)).toBeDefined();

      expect(ChatbotService.multipleFileFilters(null, {originalname: 'png.doc', fieldname: 'icon'}, (error, success) => error)).toBeDefined();
    });

    it('should return true if it is an image', async () => {
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.jpg'}, (error, success) => error)).toEqual(null);
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.png'}, (error, success) => error)).toEqual(null);

      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.jpg'}, (error, success) => success)).toEqual(true);
      expect(await ChatbotService.imageFileFilter(null, {originalname: 'doc.png'}, (error, success) => success)).toEqual(true);

      expect(ChatbotService.multipleFileFilters(null, {originalname: 'doc.png', fieldname: 'icon'}, (error, success) => success)).toEqual(true);
    });
  });
});
