import { Request, Response } from "express";

import * as e2eService from "../services/e2eService.js";

export async function reset(req: Request, res: Response) {
  await e2eService.reset();
  res.sendStatus(200);
}
