import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import { useDepartmentOptions } from "../hooks/useDepartmentOptions";
import type {
  TeacherFilterParams,
  TeacherTitle,
  ContractType,
} from "../types/teacher.types";

interface TeachersFilterFormProps {
  onFilter: (filters: TeacherFilterParams) => void;
}

const TeachersFilterForm = ({ onFilter }: TeachersFilterFormProps) => {
  const { t } = useTranslation();
  const { options: departmentOptions, isLoading: deptsLoading } =
    useDepartmentOptions();

  const [specialization, setSpecialization] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [title, setTitle] = useState<TeacherTitle | "">("");
  const [contractType, setContractType] = useState<ContractType | "">("");
  const [status, setStatus] = useState<"active" | "inactive" | "">("");

  const handleSubmit = () => {
    onFilter({
      ...(specialization ? { specialization } : {}),
      ...(departmentId ? { departmentId } : {}),
      ...(title ? { title } : {}),
      ...(contractType ? { contractType } : {}),
      ...(status ? { status } : {}),
    });
  };

  const handleReset = () => {
    setSpecialization("");
    setDepartmentId("");
    setTitle("");
    setContractType("");
    setStatus("");
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
        <Input
          height="30px"
          label={t("labels.specialization")}
          placeholder={t("labels.specialization")}
          borderRadius="7px"
          labelSize="xs"
          isFilter
          errorPlaceholder={false}
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
        />

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
          label={t("labels.title")}
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={title}
          placeholder={t("labels.all")}
          options={[
            { value: "PROF", label: t("teacher.title.PROF") },
            { value: "DR", label: t("teacher.title.DR") },
            { value: "MR", label: t("teacher.title.MR") },
            { value: "MRS", label: t("teacher.title.MRS") },
            { value: "MS", label: t("teacher.title.MS") },
          ]}
          onChange={(e) => setTitle(e.target.value as TeacherTitle | "")}
        />

        <Select
          label={t("labels.contract")}
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={contractType}
          placeholder={t("labels.all")}
          options={[
            { value: "PERMANENT", label: t("teacher.contract.PERMANENT") },
            { value: "CONTRACT", label: t("teacher.contract.CONTRACT") },
            { value: "PART_TIME", label: t("teacher.contract.PART_TIME") },
            { value: "VISITING", label: t("teacher.contract.VISITING") },
          ]}
          onChange={(e) => setContractType(e.target.value as ContractType | "")}
        />

        <Select
          label={t("labels.status")}
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={status}
          placeholder={t("labels.all")}
          options={[
            { value: "active", label: t("labels.active") },
            { value: "inactive", label: t("labels.inactive") },
          ]}
          onChange={(e) => setStatus(e.target.value as typeof status)}
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

export default TeachersFilterForm;
