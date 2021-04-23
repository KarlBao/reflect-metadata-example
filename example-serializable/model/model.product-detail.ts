import { JsonProperty, Serializable } from "../../src/lib";

@Serializable()
export class ProductCareInstruction {
  @JsonProperty() careInHeaderNo: string;
  @JsonProperty() careInHeaderText: string;
  @JsonProperty() careInText: string;
  @JsonProperty() sortNo: number;
}

@Serializable()
export class ProductDetail {
  @JsonProperty() thumbnail = "";
  @JsonProperty() imgUrlList: string[] = [];
  @JsonProperty() name = "";
  @JsonProperty() typeName = "";
  @JsonProperty() showItemNo: string = "";
  @JsonProperty() description: string = "暂无产品描述信息";
  @JsonProperty() color: string = "#ffffff";
  @JsonProperty() specifications: string = "";
  @JsonProperty() price: number = 0;
  @JsonProperty() unit: string = "";

  @JsonProperty({
    name: "careInstructions",
    type: ProductCareInstruction,
  })
  private _careInstructions: ProductCareInstruction[] = [];

  /**
   * 商品 `type` 字段从 `dsType` 映射而来
   */
  @JsonProperty("dsType") type: "sync" | "selfUpload" = "sync";

  /**
   * 商品默认初始 `active` 状态为 `false`
   */
  active: boolean = false;

  get displayPrice() {
    return `${this.price} ${this.unit}`;
  }

  get careInstructions(): ICareInstructionGroup[] {
    const careInsructionsData =
      this._careInstructions && this._careInstructions.length > 0
        ? this._careInstructions
        : [];

    const careInstructionGroups: ICareInstructionGroup[] = [];
    careInsructionsData
      .sort((a, b) => a.sortNo - b.sortNo)
      .forEach((careInstruction) => {
        let group = careInstructionGroups.find(
          (group) => group.careInHeaderNo === careInstruction.careInHeaderNo
        );
        if (!group) {
          group = {
            careInHeaderNo: careInstruction.careInHeaderNo,
            careInHeaderText: careInstruction.careInHeaderText,
            careInTextList: [],
          };
          careInstructionGroups.push(group);
        }

        group.careInTextList.push(careInstruction.careInText);
      });

    return careInstructionGroups;
  }
}

interface ICareInstructionGroup {
  careInHeaderNo: string;
  careInHeaderText: string;
  careInTextList: string[];
}
