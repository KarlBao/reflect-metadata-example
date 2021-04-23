<template>
  <div>
    <div v-if="materials.length || careInstructions.length">
      <span class="product-modal__subtitle">{{ i18n.materialsAndCare }}</span>
    </div>

    <div
      v-for="material in materials"
      :key="material.productTypeText"
      class="product-modal__material"
    >
      <div v-if="material.productTypeText !== 'null'" class="bold">
        {{ material.productTypeText }}
      </div>
      <div
        v-for="part in material.materialParts"
        :key="part.materialTextPart"
        class="product-modal__material--part"
      >
        <div v-if="part.materialTextPart !== 'null'" class="bold">
          {{ part.materialTextPart }}
        </div>
        <div v-if="part.materialText">{{ part.materialText }}</div>
      </div>
    </div>

    <span class="headerBoxV2__row1--price" v-if="item.price">
      {{ item.price | parsePrice }}{{ item.unit }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getProductDetail } from "../service/service.product-detail";
import { IProductDetail } from "../model/model.product-detail";

@Component
export default class ProductDetail extends Vue {
  item: IProductDetail = null;

  get careInstructions(): ICareInstructionGroup[] {
    const item = this.item;
    const careInsructionsData =
      item && item.careInstructions && item.careInstructions.length > 0
        ? item.careInstructions
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

  async getProductDetail(id: number) {
    const { code, data } = await getProductDetail(id);
    if (code === 200) {
      this.item = data;
    }
  }
}

interface ICareInstructionGroup {
  careInHeaderNo: string;
  careInHeaderText: string;
  careInTextList: string[];
}
</script>
