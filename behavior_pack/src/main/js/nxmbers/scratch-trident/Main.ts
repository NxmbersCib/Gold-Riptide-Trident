import { world, WorldInitializeBeforeEvent } from "@minecraft/server";
import TridentItem from "./item/TridentItem";

export default class Main {
    public static onEnabled(initalizer: WorldInitializeBeforeEvent) {
        initalizer.itemComponentRegistry.registerCustomComponent(
            "nxmbers:scratch_trident",
            new TridentItem(),
        );
    }
}

world.beforeEvents.worldInitialize.subscribe(Main.onEnabled);
