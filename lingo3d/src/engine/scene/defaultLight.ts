import { Cancellable } from "@lincode/promiselikes"
import { createEffect } from "@lincode/reactivity"
import { HemisphereLight, DirectionalLight } from "three"
import loadHDR from "../../display/utils/loaders/loadHDR"
import { getDefaultLight } from "../../states/useDefaultLight"
import scene from "./scene"

createEffect(() => {
    const defaultLight = getDefaultLight()
    if (!defaultLight) return

    if (typeof defaultLight === "string") {
        if (defaultLight === "studio") {
            const handle = new Cancellable()
            ;(async () => {
                const AreaLight = (await import("../../display/lights/AreaLight")).default
                if (handle.done) return
                
                handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, intensity: 3 }))
                handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationX: 90, intensity: 3 }))
                handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationX: -90, intensity: 3 }))
                handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationZ: 90, intensity: 3 }))
                handle.watch(Object.assign(new AreaLight(), { innerY: 1000, innerRotationX: -90, rotationZ: -90, intensity: 3 }))
            })()
            return () => {
                handle.cancel()
            }
        }
        scene.environment = loadHDR(defaultLight)
        return () => {
            scene.environment = null
        }
    }

    const skylight = new HemisphereLight(0xffffff, 0x666666, 1)
    scene.add(skylight)

    const light = new DirectionalLight(0xffffff, 0.5)
    light.position.set(0, 1, 1)
    scene.add(light)
    // light.castShadow = true
    // light.shadow.camera.near = camNear
    // light.shadow.camera.far = camFar

    return () => {
        skylight.dispose()
        scene.remove(skylight)

        light.dispose()
        scene.remove(light)
    }
}, [getDefaultLight])