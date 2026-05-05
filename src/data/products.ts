import { asset } from '@/utils/asset'

export interface Product {
  id: string
  name: string
  category: string
  price: number
  originalPrice: number
  image: string
  description?: string
  specs?: string[]
  nutrition?: string[]
}

export const categories = [
  { id: 'all', name: '所有商品' },
  { id: 'star', name: '豆之間明星商品' },
  { id: 'bean', name: '豆之間產品' },
  { id: 'bun', name: '豆之間米饅頭' },
  { id: 'cookie', name: '池上米餅' },
]

export const products: Product[] = [
  {
    id: 'soy-milk',
    name: '豆之間 | 國產豆漿',
    category: 'bean',
    price: 100,
    originalPrice: 120,
    image: asset('/photo of SC/bean/image of soy.jpg'),
    description: '【池農國產豆漿冷凍宅配】\n豆漿經過冷凍後解凍\n蛋白質會發生一些變化，\n冷凍後的豆漿會呈現細豆腐絲\n和油水分離的情況，\n並不是偷工減料，也不是壞掉喔!\n請加熱後喝。',
    specs: [
      '品名·國產豆漿(原味)',
      '成分·水100%國產非基因改造黃豆',
      '重量.960毫升',
      '保存方式.需冷藏C以下',
      '有效日期.標瓶身上',
      '保存期限.未開封7天',
      '離冷藏時間勿超過I小時,溫度變化易變質',
      '產地·台灣',
      '生產.池上豆之間',
      '地址-台東縣池上鄉中山路通水巷12號',
      '電話-089-862050',
      '過敏源：本產品含有黃豆製品',
      '保存期限：七天',
    ],
    nutrition: [
      '每100g營養成份',
      '熱量:50.9大卡',
      '蛋白質:4.9公克',
      '脂肪:2.9公克',
      '飽和脂肪:0.4公克',
      '反式脂肪:0公克',
      '碳水化合物:1.3公克',
      '糖:0.6公克',
      '鈉:9.2毫克',
    ],
  },
  {
    id: 'tofu-skin',
    name: '豆之間 | 國產豆包',
    category: 'bean',
    price: 180,
    originalPrice: 200,
    image: asset('/photo of SC/bean/image of tofu skin.jpg'),
  },
  {
    id: 'dried-tofu',
    name: '豆之間 | 國產鹽滷豆干',
    category: 'bean',
    price: 70,
    originalPrice: 90,
    image: asset('/photo of SC/bean/image of dried tofu.jpg'),
  },
  {
    id: 'black-dried-tofu',
    name: '豆之間 | 秘緻豆干',
    category: 'bean',
    price: 110,
    originalPrice: 130,
    image: asset('/photo of SC/bean/image of black dried tofu.jpg'),
  },
  {
    id: 'soy-bun',
    name: '手作米饅頭 | 豆漿口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: asset('/photo of SC/steamed bun/image of soy bread.png'),
  },
  {
    id: 'red-bean-bun',
    name: '手作米饅頭 | 紅豆口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: asset('/photo of SC/steamed bun/image of red bean.jpg'),
  },
  {
    id: 'pumpkin-bun',
    name: '手作米饅頭 | 南瓜口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: asset('/photo of SC/steamed bun/image of pumpkim bread.jpg'),
  },
  {
    id: 'brown-sugar-bun',
    name: '手作米饅頭 | 黑糖口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: asset('/photo of SC/steamed bun/image of black suger bread.jpg'),
  },
  {
    id: 'pepper-cookie',
    name: '池上米餅 | 椒鹽口味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: asset('/photo of SC/cookies/image of pepper cookies.jpg'),
  },
  {
    id: 'curry-cookie',
    name: '池上米餅 | 咖哩薑黃風味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: asset('/photo of SC/cookies/image of yellow cookies.jpg'),
  },
  {
    id: 'quinoa-cookie',
    name: '池上米餅 | 紅藜口味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: asset('/photo of SC/cookies/image of red quinoa cookies.jpg'),
  },
  {
    id: 'cheese-cookie',
    name: '池上米餅 | 起司口味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: asset('/photo of SC/cookies/image of cheese cookies.jpg'),
  },
]
