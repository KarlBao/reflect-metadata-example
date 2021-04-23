import axios from "axios";
import { deserialize } from "../../src/lib";
import { ConstructorOf } from "../../src/lib/types";

const get = async <T = any>(
  url: string,
  params = {},
  dataType?: ConstructorOf<T>
): Promise<IHttpResponse<T>> => {
  // const response = await axios.get(url, {
  //   params,
  // });
  const response = require("../../mock_data.json");
  if (dataType) {
    response.data = deserialize<T>(response.data, dataType);
  }

  return response;
};

export const request = {
  get,
};

interface IHttpResponse<T = any> {
  code: number;
  data: T;
  message: string;
}
