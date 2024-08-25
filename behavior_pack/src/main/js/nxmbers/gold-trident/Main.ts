import { world, WorldInitializeBeforeEvent } from "@minecraft/server";
import TridentItem from "./item/TridentItem";
import RiptideLevelCommand from "./command/RiptideLevelCommand";

export default class Main {
    public static onEnabled(initalizer?: WorldInitializeBeforeEvent) {
        new TridentItem();
        new RiptideLevelCommand();
    }
}

Main.onEnabled();
