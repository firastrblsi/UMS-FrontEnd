import { Dialog as ChakraDialog, CloseButton } from "@chakra-ui/react";
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  bodyOverflow?: "auto" | "visible" | "hidden";
}

export function Dialog({
  open,
  onClose,
  title,
  children,
  size = "md",
  bodyOverflow = "auto",
}: DialogProps) {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseAttempt = () => setShowConfirm(true);
  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };
  const handleCancelClose = () => setShowConfirm(false);

  return (
    <>
      {/* ── Main dialog ─────────────────────────────────────── */}
      <ChakraDialog.Root
        open={open}
        onOpenChange={(e) => !e.open && handleCloseAttempt()}
        size={size}
        motionPreset="slide-in-bottom"
        closeOnInteractOutside={false}
        trapFocus={false}
      >
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content>
            {/* Header */}
            <ChakraDialog.Header
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={6}
              py={3}
              borderBottom="1px solid"
              borderColor="var(--color-neutral-200)"
              bg="var(--color-neutral-50)"
            >
              <ChakraDialog.Title
                fontSize="lg"
                fontWeight="500"
                color="var(--color-neutral-800)"
              >
                {title}
              </ChakraDialog.Title>

              <CloseButton
                size="md"
                onClick={handleCloseAttempt}
                color="var(--color-neutral-400)"
                borderRadius="full"
                _hover={{
                  bg: "var(--color-neutral-100)",
                  color: "var(--color-neutral-700)",
                }}
              />
            </ChakraDialog.Header>

            {/* Body */}
            <ChakraDialog.Body px={6} py={5} overflowY={bodyOverflow} maxH="75vh">
              {children}
            </ChakraDialog.Body>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </ChakraDialog.Root>

      {/* ── Confirm close dialog ─────────────────────────────── */}
      <ChakraDialog.Root
        open={showConfirm}
        onOpenChange={(e) => !e.open && handleCancelClose()}
        size="sm"
        motionPreset="scale"
        trapFocus={false}
      >
        <ChakraDialog.Backdrop />
        <ChakraDialog.Positioner>
          <ChakraDialog.Content borderRadius="lg" overflow="hidden">
            <ChakraDialog.Header
              px={6}
              py={4}
              borderBottom="1px solid"
              borderColor="var(--color-neutral-200)"
              bg="var(--color-neutral-50)"
            >
              <ChakraDialog.Title
                fontSize="md"
                fontWeight="500"
                color="var(--color-neutral-800)"
              >
                {t("dialog.confirm_close_title")}
              </ChakraDialog.Title>
            </ChakraDialog.Header>

            <ChakraDialog.Body px={6} py={5}>
              <p className="text-sm text-neutral-500">
                {t("dialog.confirm_close_message")}
              </p>
            </ChakraDialog.Body>

            <ChakraDialog.Footer
              px={6}
              py={4}
              borderTop="1px solid"
              borderColor="var(--color-neutral-200)"
              display="flex"
              gap={3}
              justifyContent="flex-end"
            >
              <Button
                buttonType="secondary"
                height={36}
                radius={8}
                onClick={handleCancelClose}
              >
                {t("dialog.keep_editing")}
              </Button>
              <Button
                height={36}
                radius={8}
                onClick={handleConfirmClose}
                className="bg-red-500! hover:bg-red-600!"
              >
                {t("dialog.discard")}
              </Button>
            </ChakraDialog.Footer>
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </ChakraDialog.Root>
    </>
  );
}
