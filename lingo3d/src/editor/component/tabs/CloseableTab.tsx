import CloseIcon from "../icons/CloseIcon"
import { TabProps } from "./Tab"
import useTab from "./useTab"
import AppBarButton from "../bars/AppBarButton"

type CloseableTabProps = TabProps & {
    onClose?: (selected: boolean) => void
}

const CloseableTab = ({
    onClose,
    children,
    selected,
    disabled
}: CloseableTabProps) => {
    const { selectedSignal } = useTab(children, selected, disabled)

    return (
        <div
            className="lingo3d-bg"
            style={{
                opacity: disabled ? 0.1 : 1,
                pointerEvents: disabled ? "none" : "auto",
                marginLeft: 4,
                marginRight: 4,
                height: 20,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                background:
                    selectedSignal.value === children
                        ? "rgba(255, 255, 255, 0.1)"
                        : undefined
            }}
            onClick={
                disabled ? undefined : () => (selectedSignal.value = children)
            }
        >
            <div
                style={{
                    marginTop: -2,
                    minWidth: 30,
                    maxWidth: 100,
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden"
                }}
            >
                {children}
            </div>
            <div style={{ width: 4 }} />
            <AppBarButton
                disabled={!onClose}
                onClick={() => onClose?.(selectedSignal.value === children)}
            >
                <CloseIcon />
            </AppBarButton>
        </div>
    )
}

export default CloseableTab
