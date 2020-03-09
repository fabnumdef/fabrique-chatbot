export class RasaDomain {
  intents: string[];
  responses: { [key: string]: RasaUtterResponse[] };
  session_config: {
    session_expiration_time: number;
    carry_over_slots_to_new_session: boolean
  };

  constructor() {
    this.intents = [];
    this.responses = {};
    this.session_config = {
      session_expiration_time: 60,
      carry_over_slots_to_new_session: true
    };
  }
}

export interface RasaUtterResponse {
  text?: string;
  image?: string;
  buttons?: RasaButtonModel[];
}

export class RasaButtonModel {
  title: string;
  payload: string;

  constructor(title: string, payload?: string) {
    if (!!payload) {
      this.title = title;
      this.payload = payload;
    } else {
      this.title = title.substring(0, title.indexOf('<')).trim();
      this.payload = title.substring(title.indexOf('<') + 1, title.indexOf('>')).trim();
    }
  }
}
