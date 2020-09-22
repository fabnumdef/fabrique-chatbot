import { Test, TestingModule } from "@nestjs/testing";
import { RolesGuard } from "@guard/roles.guard";
import { ExecutionContext } from "@nestjs/common";

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;

  let roles = null;
  let reflectorStub = {
    get: (name, context) => {
      return roles
    }
  };
  let contextStub: ExecutionContext = <ExecutionContext>{
    getHandler: () => {
    },
    switchToHttp: () => {
      return {
        getRequest: () => {
          return {
            user: {
              role: 'user'
            }
          }
        }
      }
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {provide: 'Reflector', useValue: reflectorStub},
      ],
    }).compile();

    rolesGuard = module.get<RolesGuard>(RolesGuard);
    roles = null;
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  it('should return true if there is no roles', () => {
    expect(rolesGuard.canActivate(contextStub)).toEqual(true);
  });

  it('should return true if user has the role', () => {
    roles = ['robin', 'user'];
    expect(rolesGuard.canActivate(contextStub)).toEqual(true);
  });

  it('should return false if user hasnt the role', () => {
    roles = ['batman', 'admin'];
    expect(rolesGuard.canActivate(contextStub)).toEqual(false);
  });
});
