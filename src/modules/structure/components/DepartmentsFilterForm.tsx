import { Button } from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { useTranslation } from "react-i18next";

const DepartmentsFilterForm = () => {
  const { t } = useTranslation();
  return (
    <form className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-0 animate-slide-down">
        <Input
          height="30px"
          label={t("labels.name")}
          placeholder={t("labels.name")}
          borderRadius="7px"
          labelSize="xs"
          isFilter
        ></Input>
        <Input
          height="30px"
          label={t("labels.code")}
          placeholder={t("labels.code")}
          borderRadius="7px"
          labelSize="xs"
          isFilter
        ></Input>
        <Input
          height="30px"
          label={t("labels.description", "Description")}
          placeholder={t("labels.description", "Description")}
          borderRadius="7px"
          labelSize="xs"
          isFilter
        ></Input>
      </div>
      <div className="self-end flex gap-3 mt-4">
        <Button type="reset" buttonType="secondary" height={35} radius={7}>
          <span className="font-light">{t("global.reset")}</span>
        </Button>
        <Button type="submit" buttonType="primary" height={35} radius={7}>
          <span className="font-light">{t("global.search")}</span>
        </Button>
      </div>
    </form>
  );
};

export default DepartmentsFilterForm;
