import { request } from "./request";
import { ProductDetail } from "../model/model.product-detail";

export async function getProductDetail(id: number) {
  return request.get(
    "/api/fullhouse/CN/zh/product/details",
    {
      id,
    },
    ProductDetail
  );
}
