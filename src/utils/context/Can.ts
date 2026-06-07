// ** Imports createContext function
import { createContext } from "react";

// ** Imports createContextualCan function
import { createContextualCan } from "@casl/react";
import { AnyAbility } from "@casl/ability";
// ** Create Context
const defaultAbility = {
  can: () => true,
} as unknown as AnyAbility;
export const AbilityContext = createContext<AnyAbility>(defaultAbility);

// ** Init Can Context
export const Can = createContextualCan(AbilityContext.Consumer);
