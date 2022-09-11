import { upperFirst } from "@lincode/utils"
import createObject from "../../api/serializer/createObject"
import { GameObjectType } from "../../api/serializer/types"
import { container } from "../../engine/renderLoop/renderSetup"
import { emitSelectionTarget } from "../../events/onSelectionTarget"
import { point2Vec } from "../../display/utils/vec2Point"
import clientToWorld from "../../display/utils/clientToWorld"

let draggingItem: string | undefined

container.addEventListener("dragover", (e) => e.preventDefault())
container.addEventListener("dragenter", (e) => e.preventDefault())
document.addEventListener("drop", (e) => e.preventDefault())
container.addEventListener("drop", (e) => {
    if (!draggingItem) return
    const manager = createObject(draggingItem as GameObjectType)
    manager.outerObject3d.position.copy(
        point2Vec(clientToWorld(e.clientX, e.clientY))
    )
    emitSelectionTarget(manager)
})

type ObjectIconProps = {
    name: string
    iconName?: string
}

const ObjectIcon = ({ name, iconName = name }: ObjectIconProps) => {
    return (
        <div
            draggable
            onDragStart={() => (draggingItem = name)}
            onDragEnd={() => (draggingItem = undefined)}
            style={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 20,
                paddingBottom: 20
            }}
        >
            <div
                style={{
                    width: 50,
                    height: 50,
                    backgroundImage: `url(https://unpkg.com/lingo3d-editor@1.0.3/assets/${iconName}.png)`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            />
            <div
                style={{
                    marginTop: 6,
                    opacity: 0.75,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "100%"
                }}
            >
                {upperFirst(name)}
            </div>
        </div>
    )
}

export default ObjectIcon
