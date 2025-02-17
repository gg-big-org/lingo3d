import { GLTFLoader } from "./loaders/GLTFLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { Bone, Light } from "three"
import { forceGet } from "@lincode/utils"
import cloneSkinnedMesh from "../cloneSkinnedMesh"
import { handleProgress } from "./bytesLoaded"
import { getWasmPath } from "../../../states/useWasmPath"
import {
    decreaseLoadingUnpkgCount,
    increaseLoadingUnpkgCount
} from "../../../states/useLoadingUnpkgCount"

const cache = new Map<string, Promise<[GLTF, boolean]>>()
const loader = new GLTFLoader()

const dracoLoader = new DRACOLoader()
getWasmPath((wasmPath) => dracoLoader.setDecoderPath(wasmPath))
loader.setDRACOLoader(dracoLoader)

export default async (url: string, clone: boolean) => {
    const [gltf, noBone] = await forceGet(
        cache,
        url,
        () =>
            new Promise<[GLTF, boolean]>((resolve, reject) => {
                const unpkg = url.startsWith("https://unpkg.com/")
                unpkg && increaseLoadingUnpkgCount()
                loader.load(
                    url,
                    (gltf: GLTF) => {
                        const lights: Array<Light> = []

                        let noBone = true
                        for (const scene of gltf.scenes)
                            scene.traverse((child) => {
                                if (child instanceof Light) lights.push(child)
                                else if (noBone && child instanceof Bone)
                                    noBone = false

                                child.castShadow = true
                                child.receiveShadow = true
                            })
                        for (const light of lights) light.parent?.remove(light)

                        unpkg && decreaseLoadingUnpkgCount()
                        resolve([gltf, noBone])
                    },
                    handleProgress(url),
                    reject
                )
            })
    )
    if (clone) return cloneSkinnedMesh(gltf.scene, noBone, gltf.animations)

    return gltf.scene
}
