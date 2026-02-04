import { createI18n } from 'vue-i18n'

const messages = {
  tw: {
    menu: {
      signature: {
        title: '喫招牌',
        a1: '豆漿+米饅頭',
        a2: '傳統豆花',
        a3: '豆漿豆花',
        a4: '傳統古早味剉冰',
        a5: '香煎豆包',
        a6: '湯葉豆包',
      },
      main: {
        title: '食好食',
        b1: '麻油豆包米麵線',
        b2: '泡菜海鮮烏龍麵',
        b3: '乾拌麵',
        b4: '蔬菜豆包捲',
        b5: '起司豆包捲',
        b6: '培根豆包捲',
        b7: '豆包蔥油餅',
        b8: '炸豆腐',
      },
      set: {
        title: '食套餐',
        c1: '三杯猴頭菇套餐',
        c2: '猴頭菇金針豆包套餐',
        c3: '香煎鯖魚飯套餐',
        c4: '德國豬腳套餐',
        c5: '今日特餐',
      },
    },
  },
  jp: {
    menu: {
      signature: {
        title: '喫招牌',
        a1: '豆乳と米風味の蒸し饅頭',
        a2: '豆花 (トオファ )',
        a3: '豆乳と豆花',
        a4: '台湾風かき氷',
        a5: '豆腐皮',
        a6: '湯葉',
      },
      main: {
        title: '食好食',
        b1: 'ごま油豆ラップライスヌードル',
        b2: 'キムチシーフードうどん',
        b3: '乾麺',
        b4: '野菜豆腐スキンロール',
        b5: 'チーズ豆腐スキンロール',
        b6: 'ベーコン豆腐スキンロール',
        b7: '豆腐の皮とネギのパンケーキ',
        b8: '揚げ出し豆腐',
      },
      set: {
        title: '食套餐',
        c1: 'サンベイ山伏茸 (ヤマブシタケ)定食',
        c2: '山伏茸(ヤマブシタケ) えのき茸豆皮定食',
        c3: '焼きサバ定食',
        c4: 'ジャーマンポークナックルセット',
        c5: '本日のおすすめ',
      },
    },
  },
  en: {
    menu: {
      signature: {
        title: '喫招牌',
        a1: 'Soy Milk and Rice Bun set',
        a2: 'Soybean Pudding',
        a3: 'Soybean Pudding add Soy',
        a4: 'Traditional Shaved Ice',
        a5: 'Pan-fried Tofu Skin',
        a6: 'Yuba',
      },
      main: {
        title: '食好食',
        b1: 'Sesame Oil Rice Noodles',
        b2: 'Kimchi Udon with Seafood',
        b3: 'Dry Noodles',
        b4: 'Vegetable Tofu Skin Roll',
        b5: 'Cheese Tofu Skin Roll',
        b6: 'Bacon Tofu Skin Roll',
        b7: 'Scallion Pancake with Tofu Skin',
        b8: 'Fried Tofu',
      },
      set: {
        title: '食套餐',
        c1: "Three-Cup Lion's Mane Mushroom",
        c2: "Lion's Mane and Enoki Mushroom",
        c3: 'Pan-Fried Mackerel Set',
        c4: 'German Pork Knuckle set',
        c5: "Today's Special",
      },
    },
  },
}

const i18n = createI18n({
  legacy: false,
  locale: 'tw',
  fallbackLocale: 'tw',
  messages,
})

export default i18n
