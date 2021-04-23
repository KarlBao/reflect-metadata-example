export interface IProductDetail {
  // 缩略图
  thumbnail?: string;
  // 其他图片
  imgUrlList?: string[];
  // 产品名称
  name?: string;
  typeName?: string;
  dsType?: "sync" | "selfUpload";
  showItemNo?: string;
  // 产品编号
  code?: string;
  itemNo?: string;
  itemGlobalNo?: string;
  genericCode?: string;
  globalCode?: string;
  // 产品类型
  type?: string;
  // 产品描述
  description?: string;
  // 产品颜色
  color?: string;
  // 产品规格信息
  specifications?: string;
  // 产品价格
  price?: number;
  // 价格单位
  unit?: string;
  // 产品数量
  count?: number;
  // 一级目录ID
  hfbCode?: string;
  // 二级目录ID
  paCode?: string;
  // 推荐描述
  recommend?: string[];
  chooseFlag?: boolean;
  waitPick?: boolean;
  flipHorizontal?: boolean;
  hasSel?: boolean;
  topViewWidth?: string | number;
  topViewLength?: string | number;
  topViewUrl?: string;
  topViewRotate?: number;
  topViewStartX?: number;
  topViewStartY?: number;
  // 购物车Id
  cartId?: number;
  // 方案ID
  planId?: number;
  //
  hasSelTopView?: boolean;
  // 去白图片
  removeWhiteImage?: string;
  removeWhiteImageHeight?: number;
  removeWhiteImageWidth?: number;
  // 家具id
  Identifier?: string;
  // 产品颜色数组
  productColourList?: Color[];
  isAutoPlacement?: boolean;
  originId?: string | undefined;
  size?: string;
  /** 产品保养信息 */
  careInstructions?: IProductCareInstruction[];
  /** 产品材质信息 */
  materials?: IProductMaterial[];
  mainPicture?: string;
  inspirationPicture?: string;
  productSizePicture?: string;
  frontView?: {
    imgUrl: string;
    width: number;
    length: number;
  };
}

export interface Color {
  currencyCode?: string;
  imgUrlS2?: string;
  imgUrlS4?: string;
  itemNoGlobal?: string;
  itemNoLocal?: string;
  itemType?: string;
  name?: string;
  paCode?: string;
  priceInclTax?: number;
  size?: string;
  validDesignText?: string;
  unit?: string;
  price?: number;
  code?: string;
}

export interface IProductCareInstruction {
  careInHeaderNo: string;
  careInHeaderText: string;
  careInText: string;
  sortNo: number;
}

export interface IProductMaterial {
  materialText: string;
  materialTextPart: string;
  productTypeText: string;
  sortNo: number;
}
