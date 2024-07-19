import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import AbandonedCartService from "../../../services/abandoned-cart";
import MailchimpMarketingService from "../../../services/mailchimp";
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
    const mailchimpService: MailchimpMarketingService = req.scope.resolve(
      "mailchimpMarketingService",
    );
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
      addMemberToList.status !== "cleaned" &&
      addMemberToList.status !== "subscribed" &&
      addMemberToList.status !== "unsubscribed" &&
      addMemberToList.status !== "pending"
    ) {
      throw new Error("Error adding member to list");
    }

    const addTagToMember = await mailchimpService.addTagToMember(
      req.body.email,
      [{ name: "abadoned_cart", status: "active" }],
    );
    console.log(addTagToMember);

    res.status(200).json(r);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
