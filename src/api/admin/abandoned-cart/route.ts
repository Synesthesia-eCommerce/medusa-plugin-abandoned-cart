import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import AbandonedCartService from "../../../services/abandoned-cart";
import { AddOrUpdateListMemberResponse } from "../../../types";
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  try {
    const abandonedCartService: AbandonedCartService = req.scope.resolve(
      "abandonedCartService",
    );

    const { take, skip, dateLimit } = req.query as {
      take: string;
      skip: string;
      dateLimit: string;
    };

    const carts = await abandonedCartService.retrieveAbandonedCarts(
      take,
      skip,
      +dateLimit,
      true,
    );

    res
      .status(200)
      .json({ carts: carts.abandoned_carts, count: carts.total_carts });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function POST(
  req: MedusaRequest<{
    id?: string;
    email?: string;
  }>,
  res: MedusaResponse,
): Promise<void> {
  try {
    const abandonedCartService: AbandonedCartService = req.scope.resolve(
      "abandonedCartService",
    );
    const mailchimpService = req.scope.resolve("mailchimpService");
    if (!req.body.id) {
      throw new Error("No id provided");
    }
    if (!req.body.email) {
      throw new Error("No email provided");
    }

    const r = await abandonedCartService.sendAbandonedCartEmail(req.body.id);
    const addMemberToList: AddOrUpdateListMemberResponse =
      await mailchimpService.subscribeNewsletterUpdate(
        req.body.email,
        "pending",
      );
    if (
      !["cleaned", "subscribed", "unsubscribed", "pending"].includes(
        addMemberToList.status,
      )
    ) {
      throw new Error("Error adding member to list");
    }

    console.log("addMTL", addMemberToList);

    const addTagtoMember = await mailchimpService.addMemberTags(
      req.body.email,
      [{ name: "abandoned_cart", status: "active" }],
    );
    console.log("addTagtoMember", addTagtoMember);
    res.status(200).json(r);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
