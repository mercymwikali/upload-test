import { ActionFunctionArgs, json, unstable_createMemoryUploadHandler, unstable_parseMultipartFormData} from "@remix-run/node";
import fs from 'fs';

const MAX_SIZE = 5 * 1024 * 1024;

export async function loader({ }: ActionFunctionArgs) {
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await unstable_parseMultipartFormData(request, unstable_createMemoryUploadHandler({ maxPartSize: MAX_SIZE }));
  const dataFile = Object.fromEntries(formData);

  fs.writeFileSync('./upload.json', JSON.stringify(dataFile));

  return json(dataFile);
}
