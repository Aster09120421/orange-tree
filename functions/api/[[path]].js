import { handleApi } from "../../worker/api.js";

export async function onRequest(context) {
  return handleApi(context);
}
