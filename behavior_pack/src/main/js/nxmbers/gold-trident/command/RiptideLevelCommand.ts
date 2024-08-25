import {
    EntityEquippableComponent,
    EquipmentSlot,
    Player,
    ScriptEventCommandMessageAfterEvent,
    system,
} from "@minecraft/server";

export default class RiptideLevelCommand {
    public constructor() {
        system.afterEvents.scriptEventReceive.subscribe(
            this.onMessageSend.bind(this),
        );
    }

    private onMessageSend(event: ScriptEventCommandMessageAfterEvent) {
        if (
            event.id != "nxmbers:riptide_level" ||
            !event.sourceEntity ||
            !(event.sourceEntity instanceof Player)
        ) {
            return;
        }

        const player = event.sourceEntity;
        const equippable = player.getComponent(
            "equippable",
        ) as EntityEquippableComponent;

        const item = equippable.getEquipment(EquipmentSlot.Mainhand);
        
        if (item?.typeId != "nxmbers:gold_trident") {
            player.sendMessage(
                "§cYou are not holding a gold trident!",
            );
            return;
        }

        const level = parseInt(event.message?.trim() ?? "1");

        if (isNaN(level)) {
            player.sendMessage(
                "§cYou entered an invalid riptide level, it should be a number in range 1-3",
            );
            return;
        }

        item.setDynamicProperty("nxmbers:riptide_level", level);
        item.setLore(["§r§7Riptide " + "I".repeat(level)])
        
        equippable.setEquipment(EquipmentSlot.Mainhand, item);
    }
}
