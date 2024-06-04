import { NextRequest } from "next/server";
import images from "./index";
import { decodeBase64 } from "@/funcs/base64";

// export const runtime = 'edge';
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const name = params.get("name");
  const frameImageData = params.get("image");
  const frameData = decodeBase64(frameImageData);
  const frameName = Object.keys(images).filter((filter: string) => filter.toLowerCase() === name?.toLowerCase())[0];
  const frameComponent = images[frameName];
  const res = await frameComponent({ frameData });

  return res;
}
