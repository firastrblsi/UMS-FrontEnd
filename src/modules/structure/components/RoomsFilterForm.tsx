import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import type { RoomFilterParams } from "../api/roomApi";

interface RoomsFilterFormProps {
  onFilter: (filters: RoomFilterParams) => void;
}

const RoomsFilterForm = ({ onFilter }: RoomsFilterFormProps) => {
  const { t } = useTranslation();

  const [type, setType] = useState<"" | "CLASSROOM" | "LABORATORY" | "AMPHITHEATER" | "MEETING_ROOM" | "OFFICE" | "OTHER">("");
  const [building, setBuilding] = useState("");
  const [isActive, setIsActive] = useState<"true" | "false" | "">("");

  const handleSubmit = () => {
    onFilter({
      ...(type ? { type } : {}),
      ...(building ? { building } : {}),
      ...(isActive ? { isActive: isActive === "true" } : {}),
    });
  };

  const handleReset = () => {
    setType("");
    setBuilding("");
    setIsActive("");
    onFilter({});
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 animate-slide-down">
        <Select
          label="Room Type"
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={type}
          placeholder={t("labels.all")}
          options={[
            { value: "CLASSROOM", label: "Classroom" },
            { value: "LABORATORY", label: "Laboratory" },
            { value: "AMPHITHEATER", label: "Amphitheater" },
            { value: "MEETING_ROOM", label: "Meeting Room" },
            { value: "OFFICE", label: "Office" },
            { value: "OTHER", label: "Other" },
          ]}
          onChange={(e) => setType(e.target.value as any)}
        />

        <Input
          height="30px"
          label="Building"
          placeholder="Building"
          borderRadius="7px"
          labelSize="xs"
          isFilter
          errorPlaceholder={false}
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
        />

        <Select
          label={t("labels.status")}
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={isActive}
          placeholder={t("labels.all")}
          options={[
            { value: "true", label: t("labels.active") },
            { value: "false", label: t("labels.inactive") },
          ]}
          onChange={(e) => setIsActive(e.target.value as typeof isActive)}
        />
      </div>

      <div className="self-end flex gap-3 mt-4">
        <Button
          type="button"
          buttonType="secondary"
          height={35}
          radius={7}
          onClick={handleReset}
        >
          <span className="font-light">{t("global.reset")}</span>
        </Button>
        <Button type="submit" buttonType="primary" height={35} radius={7}>
          <span className="font-light">{t("global.search")}</span>
        </Button>
      </div>
    </form>
  );
};

export default RoomsFilterForm;
