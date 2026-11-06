import { ibaaMailingAddress } from "@shared/ibaaMailingAddress";

export const donationMailingAddress = {
  ...ibaaMailingAddress,
  instructions: `Please mail checks to ${ibaaMailingAddress.recipient}, ${ibaaMailingAddress.street}, ${ibaaMailingAddress.locality}.`,
};
