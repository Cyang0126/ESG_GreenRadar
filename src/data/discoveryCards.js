import { companies } from "./companies.js";
import { buildDiscoveryCards } from "../engine/discoveryRanking.js";

export const discoveryCards = buildDiscoveryCards(companies);
