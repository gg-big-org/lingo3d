import { pull } from "@lincode/utils"
import { createContext } from "preact"
import { useContext, useEffect, useLayoutEffect } from "preact/hooks"

export const TabContext = createContext<{
    selected: string | undefined
    setSelected: (val: string | undefined) => void
    tabs: Array<string>
}>({ selected: "", setSelected: () => {}, tabs: [] })

export type TabProps = {
    children?: string
    selected?: boolean
    disabled?: boolean
    half?: boolean
}

const Tab = ({ children, selected, disabled, half }: TabProps) => {
    const context = useContext(TabContext)

    useLayoutEffect(() => {
        if (!children) return
        context.tabs.push(children)
        return () => {
            context.setSelected(
                context.tabs[context.tabs.indexOf(children) - 1]
            )
            pull(context.tabs, children)
        }
    }, [])

    useEffect(() => {
        selected && context.setSelected(children)
    }, [])

    return (
        <div
            className="lingo3d-bg"
            style={{
                width: half ? "50%" : undefined,
                opacity: disabled ? 0.1 : 1,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: half ? undefined : 12,
                background:
                    context.selected === children
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={disabled ? undefined : () => context.setSelected(children)}
        >
            <div style={{ marginTop: -2 }}>{children}</div>
        </div>
    )
}

export default Tab
