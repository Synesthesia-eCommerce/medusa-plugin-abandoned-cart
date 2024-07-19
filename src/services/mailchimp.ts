/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionBaseService, Logger } from "@medusajs/medusa";
import * as mailchimp from "@mailchimp/mailchimp_marketing";
import * as crypto from "crypto";
import { MailchimpPluginOptions, AddOrUpdateListMemberPayload } from "../types";
import { Lifetime } from "awilix";
export default class MailchimpMarketingService extends TransactionBaseService {
  static LIFE_TIME = Lifetime.TRANSIENT;
  protected options_: MailchimpPluginOptions;
  protected mailchimp_: any;
  logger: Logger;
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    e.g.
   *    {
   *      api_key: Mailchimp api key
   *      newsletter_list_id: "123456789"
   *    }
   */
  constructor(_, options: MailchimpPluginOptions) {
    super(_, options);
    this.options_ = options;
    try {
      this.mailchimp_ = mailchimp.setConfig({
        apiKey: this.options_.api_key,
        server: this.options_.server,
      });
    } catch (error) {
      this.mailchimp_ = undefined;
      this.logger.error("Mailchimp API key is invalid");
    }
    this.logger = _.logger;
  }

  /**
   * Subscribes an email to a newsletter.
   * @param {string} email - email to use for the subscription
   * @param {Object} data - additional data (see https://mailchimp.com/developer/marketing/api/list-merges/)
   * @return {Promise} result of newsletter subscription
   */
  async subscribeNewsletterAdd(
    email: string,
    data: AddOrUpdateListMemberPayload,
  ) {
    return this.mailchimp_.post(
      `/lists/${this.options_.newsletter_list_id}/members`,
      {
        email_address: email,
        status: "subscribed",
        ...data,
      },
    );
  }

  async getMemberInfo(email: string) {
    return this.mailchimp_.lists.getListMember(
      this.options_.newsletter_list_id,
      email,
    );
  }

  /**
   * Updates an email to a newsletter.
   * @param {string} email - email to use for the subscription
   * @param {Object} data - additional data (see https://mailchimp.com/developer/marketing/api/list-merges/)
   * @return {Promise} result of newsletter subscription
   */

  async subscribeNewsletterUpdate(
    email: string,
    statusIfNew?: string,
    data?: AddOrUpdateListMemberPayload,
  ) {
    const lowercase = email.toLowerCase();
    const hash = crypto.createHash("md5").update(lowercase).digest("hex");

    return this.mailchimp_.put(
      `/lists/${this.options_.newsletter_list_id}/members/${hash}`,
      {
        email_address: email,
        status_if_new: statusIfNew || "subscribed",
        ...data,
      },
    );
  }
  async addTagToMember(
    email: string,
    tags: { name: string; status: string }[],
  ) {
    const lowercase = email.toLowerCase();
    const hash = crypto.createHash("md5").update(lowercase).digest("hex");
    return this.mailchimp_.post(
      `/lists/${this.options_.newsletter_list_id}/members/${hash}/tags`,
      {
        tags,
      },
    );
  }
}
