import { IpAdressValidator } from "./ip-adress.validator";

describe('IP Adress Validator', () => {

  let ipAdressValidator: IpAdressValidator;

  beforeEach(async () => {
    ipAdressValidator = new IpAdressValidator();
  })

  it('return false if the IP adress is not valid', () => {
    expect(ipAdressValidator.validate(null)).toBeFalsy();
    expect(ipAdressValidator.validate(undefined)).toBeFalsy();
    expect(ipAdressValidator.validate('')).toBeFalsy();
    expect(ipAdressValidator.validate('hello')).toBeFalsy();
  });

  it('return true if the IP adress is valid', () => {
    expect(ipAdressValidator.validate('127.0.0.1')).toBeTruthy();
  });

  it('have a default error message', () => {
    expect(ipAdressValidator.defaultMessage()).toEqual(`L'adresse IP ne respecte pas le bon format.`);
  });
})
