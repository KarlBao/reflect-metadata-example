import { request } from "./request";
import { IProductDetail } from "../model/model.product-detail";

export async function getProductDetail(id: number) {
  const response = await request.get<IProductDetail>(
    "/api/fullhouse/CN/zh/product/details",
    {
      id,
    }
  );

  /**
   * 商品默认初始 `active` 状态为 `false`
   */
  response.data = Object.assign(
    {
      active: false,
    },
    response.data
  );

  /**
   * 商品 `type` 字段从 `dsType` 映射而来
   */
  response.data.type = response.data.dsType;

  return response;
}
