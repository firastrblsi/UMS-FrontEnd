import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/ui/Button";
import Select from "@/shared/ui/Select";
import type { StudentFilterParams, StudentStatus, ScholarshipType } from "../types/student.types";

interface StudentsFilterFormProps {
  onFilter: (filters: StudentFilterParams) => void;
}

const StudentsFilterForm = ({ onFilter }: StudentsFilterFormProps) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<StudentStatus | "">("");
  const [scholarshipType, setScholarshipType] = useState<ScholarshipType | "">("");

  const handleSubmit = () => {
    onFilter({
      ...(status ? { status } : {}),
      ...(scholarshipType ? { scholarshipType } : {}),
    });
  };

  const handleReset = () => {
    setStatus("");
    setScholarshipType("");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-0 animate-slide-down">
        <Select
          label={t("labels.status", "Status")}
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={status}
          placeholder={t("labels.all")}
          options={[
            { value: "ENROLLED", label: t("student.status.ENROLLED") },
            { value: "SUSPENDED", label: t("student.status.SUSPENDED") },
            { value: "GRADUATED", label: t("student.status.GRADUATED") },
            { value: "WITHDRAWN", label: t("student.status.WITHDRAWN") },
            { value: "DEFERRED", label: t("student.status.DEFERRED") },
          ]}
          onChange={(e) => setStatus(e.target.value as typeof status)}
        />
        
        <Select
          label={t("labels.scholarship", "Scholarship")}
          labelSize="xs"
          isFilter
          height="30px"
          borderRadius="7px"
          value={scholarshipType}
          placeholder={t("labels.all")}
          options={[
            { value: "NONE", label: t("student.scholarship.NONE") },
            { value: "PARTIAL", label: t("student.scholarship.PARTIAL") },
            { value: "FULL", label: t("student.scholarship.FULL") },
            { value: "MERIT", label: t("student.scholarship.MERIT") },
          ]}
          onChange={(e) => setScholarshipType(e.target.value as typeof scholarshipType)}
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

export default StudentsFilterForm;
