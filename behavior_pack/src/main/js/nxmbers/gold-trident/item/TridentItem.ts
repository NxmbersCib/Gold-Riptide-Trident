import {
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
    }

    public applyImpulse(player: Player, vector: Vector3) {
        const { x, y, z } = vector;
        const horizontal = Math.sqrt(x * x + z * z) * 2.0;
        const vertical = y < 0.0 ? 0.5 * y : y;
        player.applyKnockback(x, z, horizontal, vertical);
    }

    public async onReleaseUse(event: ItemReleaseUseAfterEvent) {
        try {
            const { source: player, itemStack, useDuration } = event;

            if (
                itemStack?.typeId != "nxmbers:gold_trident" ||
                useDuration > 71990 ||
                !player.isInWater
            ) {
                return;
            }

            const level = (itemStack.getDynamicProperty(
                "nxmbers:riptide_level",
            ) ?? 1) as number;

            if (!level) {
                return;
            }

            let f = player.getRotation().y;
            let g = player.getRotation().x;

            let RAD = 0.017453292;

            let h = -Math.sin(f * RAD) * Math.cos(g * RAD);
            let l = -Math.sin(g * RAD);

            let m = Math.cos(f * RAD) * Math.cos(g * RAD);
            let n = Math.sqrt(h * h + l * l + m * m);

            let lvl = 3;

            switch (level) {
                case 1:
                    lvl = level - 2;
                    break;
                case 2:
                    lvl = level - 1.5;
                    break;
                case 3:
                    lvl = 3;
                    break;
            }

            let o = 2.0 * (1.0 + lvl / 4.0);

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
