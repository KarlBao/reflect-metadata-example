import "reflect-metadata";
import { getProductDetail } from "./example-serializable/service/service.product-detail";

async function getInfo() {
  const { data } = await getProductDetail(1);
  console.log(data);
  console.log("displayPrice:", data.displayPrice);
}

getInfo();
