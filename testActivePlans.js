// testActivePlans.js
import { getActivePlans } from "./services/getActivePlans.js";

async function test() {
  const plans = await getActivePlans();
  console.log("Planes activos:", plans);
}

test();
