import { Cancellable } from "@lincode/promiselikes"
import { debounce } from "@lincode/utils"
import { Object3D } from "three"
import StaticObjectManager from ".."
import Appendable, { appendableRoot } from "../../../../api/core/Appendable"
import {
    onSelectionTarget,
    emitSelectionTarget
} from "../../../../events/onSelectionTarget"
import { getSelectionFocus } from "../../../../states/useSelectionFocus"
import { getSelectionFrozen } from "../../../../states/useSelectionFrozen"
import VisibleObjectManager from "../../VisibleObjectManager"

const selectionCandidates = new Set<Object3D>()
export default selectionCandidates

export const unselectableSet = new WeakSet<StaticObjectManager>()
export const manualSelectionCandidates = new Set<Object3D>()

export const addSelectionHelper = (
    helper: VisibleObjectManager,
    manager: Appendable
) => {
    appendableRoot.delete(helper)
    manager.outerObject3d.add(helper.outerObject3d)
    manualSelectionCandidates.add(helper.nativeObject3d)

    helper.castShadow = false
    helper.receiveShadow = false

    const handle = onSelectionTarget(
        ({ target }) => target === helper && emitSelectionTarget(manager)
    )
    return new Cancellable(() => {
        helper.dispose()
        manualSelectionCandidates.delete(helper.nativeObject3d)
        handle.cancel()
    })
}

const traverse = (
    targets:
        | Array<Appendable | StaticObjectManager>
        | Set<Appendable | StaticObjectManager>,
    frozenSet: Set<Appendable>
) => {
    for (const manager of targets) {
        if (frozenSet.has(manager)) continue

        if ("addToRaycastSet" in manager && !unselectableSet.has(manager))
            //@ts-ignore
            manager.addToRaycastSet(selectionCandidates)

        manager.children && traverse(manager.children, frozenSet)
    }
}

export const getSelectionCandidates = debounce(
    (targets: Array<Appendable> | Set<Appendable> = appendableRoot) => {
        const [frozenSet] = getSelectionFrozen()
        selectionCandidates.clear()
        traverse(targets, frozenSet)
        for (const candidate of manualSelectionCandidates)
            selectionCandidates.add(candidate)
    },
    0,
    "trailing"
)

getSelectionFrozen(() => {
    getSelectionCandidates()
    emitSelectionTarget()
})

getSelectionFocus(() => {
    getSelectionCandidates()
    emitSelectionTarget()
})
