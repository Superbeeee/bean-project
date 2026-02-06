/**
 * Seed script: 將靜態商品資料匯入 Firestore
 *
 * 使用步驟:
 *   1. 到 Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰
 *   2. 下載 JSON 檔案，放到專案根目錄命名為 serviceAccountKey.json
 *   3. 安裝依賴: npm install firebase-admin tsx --save-dev
 *   4. 執行: npx tsx scripts/seed-products.ts
 */

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 讀取 Service Account Key
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const serviceAccountPath = resolve(__dirname, '..', 'serviceAccountKey.json')
let serviceAccount: Record<string, string>
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'))
} catch {
  console.error('❌ 找不到 serviceAccountKey.json')
  console.error('   請到 Firebase Console → 專案設定 → 服務帳戶 → 產生新的私密金鑰')
  console.error('   下載後放到專案根目錄，命名為 serviceAccountKey.json')
  process.exit(1)
}

// 初始化 Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
})
const db = getFirestore(app)

// ============================================================
// 資料定義
// ============================================================
const categories = [
  { id: 'all', name: '所有商品' },
  { id: 'star', name: '豆之間明星商品' },
  { id: 'bean', name: '豆之間產品' },
  { id: 'bun', name: '豆之間米饅頭' },
  { id: 'cookie', name: '池上米餅' },
]

const products = [
  {
    id: 'soy-milk',
    name: '豆之間 | 國產豆漿',
    category: 'bean',
    price: 100,
    originalPrice: 120,
    image: '/photo of SC/bean/image of soy.jpg',
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
    image: '/photo of SC/bean/image of tofu skin.jpg',
  },
  {
    id: 'dried-tofu',
    name: '豆之間 | 國產鹽滷豆干',
    category: 'bean',
    price: 70,
    originalPrice: 90,
    image: '/photo of SC/bean/image of dried tofu.jpg',
  },
  {
    id: 'black-dried-tofu',
    name: '豆之間 | 秘緻豆干',
    category: 'bean',
    price: 110,
    originalPrice: 130,
    image: '/photo of SC/bean/image of black dried tofu.jpg',
  },
  {
    id: 'soy-bun',
    name: '手作米饅頭 | 豆漿口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: '/photo of SC/steamed bun/image of soy bread.png',
  },
  {
    id: 'red-bean-bun',
    name: '手作米饅頭 | 紅豆口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: '/photo of SC/steamed bun/image of red bean.jpg',
  },
  {
    id: 'pumpkin-bun',
    name: '手作米饅頭 | 南瓜口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: '/photo of SC/steamed bun/image of pumpkim bread.jpg',
  },
  {
    id: 'brown-sugar-bun',
    name: '手作米饅頭 | 黑糖口味',
    category: 'bun',
    price: 150,
    originalPrice: 180,
    image: '/photo of SC/steamed bun/image of black suger bread.jpg',
  },
  {
    id: 'pepper-cookie',
    name: '池上米餅 | 椒鹽口味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: '/photo of SC/cookies/image of pepper cookies.jpg',
  },
  {
    id: 'curry-cookie',
    name: '池上米餅 | 咖哩薑黃風味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: '/photo of SC/cookies/image of yellow cookies.jpg',
  },
  {
    id: 'quinoa-cookie',
    name: '池上米餅 | 紅藜口味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: '/photo of SC/cookies/image of red quinoa cookies.jpg',
  },
  {
    id: 'cheese-cookie',
    name: '池上米餅 | 起司口味',
    category: 'cookie',
    price: 120,
    originalPrice: 140,
    image: '/photo of SC/cookies/image of cheese cookies.jpg',
  },
]

// ============================================================
// 匯入 Firestore
// ============================================================
async function seed() {
  console.log('🚀 開始匯入資料到 Firestore...\n')

  // 匯入 categories
  console.log('📂 匯入 categories...')
  for (const cat of categories) {
    const { id, ...data } = cat
    await db.collection('categories').doc(id).set(data)
    console.log(`   ✅ ${id} → ${data.name}`)
  }

  // 匯入 products
  console.log('\n📦 匯入 products...')
  for (const product of products) {
    const { id, ...data } = product
    await db.collection('products').doc(id).set(data)
    console.log(`   ✅ ${id} → ${data.name}`)
  }

  console.log(`\n🎉 完成！已匯入 ${categories.length} 個分類、${products.length} 個商品`)
}

seed().catch((err) => {
  console.error('❌ 匯入失敗:', err)
  process.exit(1)
})
