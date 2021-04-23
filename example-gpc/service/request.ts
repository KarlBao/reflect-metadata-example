import axios from "axios";

const get = async <T = any>(
  url: string,
  params = {}
): Promise<IHttpResponse<T>> => {
  const response = await axios.get(url, {
    params,
  });
  return response.data;
};

export const request = {
  get,
};

interface IHttpResponse<T = any> {
  code: number;
  data: T;
  message: string;
}
