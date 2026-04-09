/**
 * This scripts takes an array of CPI values, and change their base.
 *
 * ## HOW TO USE
 *
 * 1. Copy the values from the `src/data/cpiData.json` file.
 * 2. Change the value of BASE_NEW
 * 3. Run the script
 *
 * That's it.
 *
 * The old base is the first value in the array.
 */

const cpiJson = {
  '2023-12': 100,
  '2024-01': 100.29999999999998,
  '2024-02': 100.09939999999999,
  '2024-03': 100.29959879999998,
  '2024-04': 100.19929920119998,
  '2024-05': 100.70029569720597,
  '2024-06': 101.1030968799948,
  '2024-07': 101.50750926751478,
  '2024-08': 101.7105242860498,
  '2024-09': 102.11736638319401,
  '2024-10': 102.3216011159604,
  '2024-11': 102.62856591930827,
  '2024-12': 102.93645161706618,
  '2025-01': 105.6127993591099,
  '2025-02': 106.03525055654634,
  '2025-03': 106.45939155877252,
  '2025-04': 106.56585095033128,
  '2025-05': 106.6724168012816,
  '2025-06': 106.6724168012816,
  '2025-07': 106.77908921808287,
  '2025-08': 107.2062055749552,
  '2025-09': 107.2062055749552,
  '2025-10': 107.31341178053015,
  '2025-11': 107.95729225121333,
  '2025-12': 108.06524954346453,
  '2026-01': 108.17331479300799,
  '2026-02': 108.389661422594,
};

const BASE_NEW = 1000;

// ----------------------------

const cpiArr = Object.values(cpiJson);
const [BASE_OLD] = cpiArr;

const newCpr = [];

const ratio = BASE_NEW / BASE_OLD;

for (const cpiValue of cpiArr) {
  newCpr.push(cpiValue * ratio);
}

const output = JSON.stringify(newCpr, null, 2);

console.log(output);
