export class RasaNlu {
  rasa_nlu_data: {
    common_examples: RasaNluCommonExample[]
  };

  constructor() {
    this.rasa_nlu_data = {
      common_examples: []
    };
  }
}

interface RasaNluCommonExample {
  intent: string;
  text: string;
}
