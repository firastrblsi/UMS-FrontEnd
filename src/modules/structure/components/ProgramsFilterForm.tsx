import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";
import { useDepartmentOptions } from "../../teachers/hooks/useDepartmentOptions";
import type { ProgramFilterParams } from "../api/programApi";

interface ProgramsFilterFormProps {
  onFilter: (filters: ProgramFilterParams) => void;
}

const ProgramsFilterForm = ({ onFilter }: ProgramsFilterFormProps) => {
  const { t } = useTranslation();
  const { options: departmentOptions, isLoading: deptsLoading } = useDepartmentOptions();

  const [departmentId, setDepartmentId] = useState("");
  const [degreeType, setDegreeType] = useState<"BACHELOR" | "MASTER" | "DIPLOMA" | "CERTIFICATE" | "">("");
  const [isActive, setIsActive] = useState<"true" | "false" | "">("");

  const handleSubmit = () => {
    onFilter({
      ...(departmentId ? { departmentId } : {}),
      ...(degreeType ? { degreeType } : {}),
      ...(isActive ? { isActive: isActive === "true" } : {}),
    });
  };

  const handleReset = () => {
    setDepartmentId("");
    setDegreeType("");
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
          label={t("labels.department")}
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={departmentId}
          placeholder={deptsLoading ? "…" : t("labels.all")}
          options={departmentOptions}
          onChange={(e) => setDepartmentId(e.target.value)}
        />

        <Select
          label="Degree Type"
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={degreeType}
          placeholder={t("labels.all")}
          options={[
            { value: "BACHELOR", label: "Bachelor" },
            { value: "MASTER", label: "Master" },
            { value: "DIPLOMA", label: "Diploma" },
            { value: "CERTIFICATE", label: "Certificate" },
          ]}
          onChange={(e) => setDegreeType(e.target.value as typeof degreeType)}
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

export default ProgramsFilterForm;
