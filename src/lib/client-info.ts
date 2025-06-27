import * as uaParser from "ua-parser-js";

export interface ClientInfo {
  browser: {
    name: string;
    version: string;
  };
  device: {
    type: string;
    model: string;
  };
  os: {
    name: string;
    version: string;
  };
  cpu: string;
}

export const getClientInfo = () => {
  const parser = new uaParser.UAParser();
  const result = parser.getResult();

  return {
    browser: {
      name: result.browser.name || "Unknown",
      version: result.browser.version || "0.0.0",
    },
    device: {
      type: result.device.type || "unknown",
      model: result.device.model || "Unknown",
    },
    os: {
      name: result.os.name || "Unknown",
      version: result.os.version || "0.0.0",
    },
    cpu: result.cpu.architecture || "unknown",
  } as ClientInfo;
};
