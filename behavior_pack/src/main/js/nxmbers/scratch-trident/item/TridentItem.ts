import {
    ItemComponentCompleteUseEvent,
    ItemCustomComponent,
} from "@minecraft/server";

export default class TridentItem implements ItemCustomComponent {
    public onCompleteUse(event: ItemComponentCompleteUseEvent) {}
}
