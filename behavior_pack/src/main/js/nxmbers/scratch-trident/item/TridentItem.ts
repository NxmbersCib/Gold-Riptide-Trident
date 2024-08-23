import {
    EntityEquippableComponent,
    EquipmentSlot,
    ItemComponentCompleteUseEvent,
    ItemCustomComponent,
    ItemFoodComponent,
    ItemReleaseUseAfterEvent,
    Player,
    system,
    Vector3,
    world,
} from "@minecraft/server";
import { Vector3Builder } from "../../util/vector/VectorWrapper";
import { clampNumber } from "../../util/general/Clamp";

export default class TridentItem {
    public constructor() {
        world.afterEvents.itemReleaseUse.subscribe(
            this.onReleaseUse.bind(this),
        );
        system.runInterval(() => system.runJob(this.tridentDrawController()));
    }

    public *tridentDrawController() {
        for (const player of world.getAllPlayers()) {
            const equippable = player.getComponent(
                "equippable",
            ) as EntityEquippableComponent;
            const item = equippable.getEquipment(EquipmentSlot.Mainhand);
            if (item.typeId != "nxmbers:mcc_trident") {
                continue;
            }
            const food = item.getComponent("food") as ItemFoodComponent
            
        }
    }

    public applyImpulse(player: Player, vector: Vector3) {
        const { x, y, z } = vector;
        const horizontal = Math.sqrt(x * x + z * z) * 2.0;
        const vertical = y < 0.0 ? 0.5 * y : y;
        player.applyKnockback(x, z, horizontal, vertical);
    }

    public async onReleaseUse(event: ItemReleaseUseAfterEvent) {
        try {
            const { source: player, itemStack } = event;

            if (itemStack?.typeId != "nxmbers:mcc_trident") {
                return;
            }

            let f = player.getRotation().y;
            let g = player.getRotation().x;

            let RAD = 0.017453292;

            let h = -Math.sin(f * RAD) * Math.cos(g * RAD);
            let l = -Math.sin(g * RAD);

            let m = Math.cos(f * RAD) * Math.cos(g * RAD);
            let n = Math.sqrt(h * h + l * l + m * m);

            let o = 2.0 * (1.0 + 3 / 4.0);

            h *= o / n;
            l *= o / n;
            m *= o / n;

            player.isOnGround
                ? this.applyImpulse(
                      player,
                      new Vector3Builder(0, 1.1999999284744263, 0),
                  )
                : 0;
            await system.waitTicks(1);

            const impulse = new Vector3Builder(h, clampNumber(l, -3, 3), m);
            this.applyImpulse(player, impulse);
            console.warn(l);
            // if (player.isOnGround) {
            //     this.applyImpulse(
            //         player,
            //         new Vector3Builder(player.getVelocity()).add(
            //             new Vector3Builder( 0, 1.1999999284744263, 0),
            //         ),
            //     );
            // }
            const sound = `item.trident.riptide_${Math.floor(
                Math.random() * (3 - 1) + 1,
            )}`;
            player.dimension.playSound(sound, player.location);
            player.playSound(sound);
        } catch (error) {
            console.error(error, error.stack);
        }
    }
}
