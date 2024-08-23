import { world, WorldInitializeBeforeEvent } from "@minecraft/server";
import TridentItem from "./item/TridentItem";

export default class Main {
    public static onEnabled(initalizer?: WorldInitializeBeforeEvent) {
        new TridentItem();
    }
}

Main.onEnabled();
