import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({ name: "ipAdress", async: false })
export class IpAdressValidator implements ValidatorConstraintInterface {

  validate(ipAdress: string) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipAdress);
  }

  defaultMessage() {
    return `L'adresse IP ne respecte pas le bon format.`;
  }

}
