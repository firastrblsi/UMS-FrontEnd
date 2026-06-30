"use client"

import {
  Toaster as ChakraToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  createToaster,
} from "@chakra-ui/react"

export const toaster = createToaster({
  placement: "bottom-end",
  pauseOnPageIdle: false,
})

const BAR: Record<string, string> = {
  success: "#22c55e",
  error:   "#f43f5e",
  warning: "#f59e0b",
  info:    "#21bfc2",
  loading: "#004371",
}

const ICON_BG: Record<string, string> = {
  success: "#f0fdf4",
  error:   "#fff1f2",
  warning: "#fffbeb",
  info:    "#e8fafa",
  loading: "#e6eef4",
}

export const Toaster = () => {
  return (
    <Portal>
      <ChakraToaster toaster={toaster} insetInline={{ mdDown: "4" }}>
        {(toast) => {
          const type = toast.type ?? "info"
          const bar = BAR[type] ?? BAR.info
          const iconBg = ICON_BG[type] ?? ICON_BG.info
          return (
            <Toast.Root
              width={{ md: "sm" }}
              css={{
                fontFamily: "'Poppins', system-ui, sans-serif",
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
                border: "1px solid #f1f5f9",
                paddingInline: "8px",
                paddingBlock: "10px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              {/* Colored left accent bar rendered as a sibling div */}
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: bar,
                  borderRadius: "16px 0 0 16px",
                }}
              />

              <div style={{ paddingLeft: "8px", display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                {toast.type === "loading" ? (
                  <Spinner size="sm" color="blue.solid" flexShrink={0} />
                ) : (
                  <Toast.Indicator
                    css={{
                      background: iconBg,
                      borderRadius: "50%",
                      width: "28px",
                      height: "28px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: bar,
                      "& svg": { width: "14px", height: "14px" },
                    }}
                  />
                )}

                <Stack gap="0.5" flex="1" maxWidth="100%">
                  {toast.title && (
                    <Toast.Title
                      css={{
                        fontFamily: "'Poppins', system-ui, sans-serif",
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1e293b",
                        lineHeight: 1.4,
                      }}
                    >
                      {toast.title}
                    </Toast.Title>
                  )}
                  {toast.description && (
                    <Toast.Description
                      css={{
                        fontFamily: "'Poppins', system-ui, sans-serif",
                        fontSize: "12px",
                        color: "#64748b",
                        lineHeight: 1.4,
                      }}
                    >
                      {toast.description}
                    </Toast.Description>
                  )}
                </Stack>

                {toast.action && (
                  <Toast.ActionTrigger
                    css={{
                      fontFamily: "'Poppins', system-ui, sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#004371",
                      cursor: "pointer",
                    }}
                  >
                    {toast.action.label}
                  </Toast.ActionTrigger>
                )}

                {toast.closable && (
                  <Toast.CloseTrigger
                    css={{
                      color: "#94a3b8",
                      cursor: "pointer",
                      fontSize: "16px",
                      lineHeight: 1,
                      transition: "color 150ms",
                    }}
                  />
                )}
              </div>
            </Toast.Root>
          )
        }}
      </ChakraToaster>
    </Portal>
  )
}
