import {ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({ name: "domainName", async: false })
export class DomainNameValidator implements ValidatorConstraintInterface {

  validate(domainName: string) {
    return /^[a-z-]+$/.test(domainName);
  }

  defaultMessage() {
    return `Le nom de domaine ne respecte pas le bon format.`;
  }

}
