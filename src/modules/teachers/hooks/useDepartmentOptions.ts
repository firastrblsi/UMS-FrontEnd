import { useState, useEffect } from 'react';
import type { SelectOption } from '@/shared/ui/Select';
import { departmentApi } from '@/modules/structure/api/departmentApi';

interface UseDepartmentOptionsResult {
  options: SelectOption[];
  isLoading: boolean;
}

export function useDepartmentOptions(): UseDepartmentOptionsResult {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    departmentApi
      .getDepartments({ take: 200 })
      .then((result) =>
        setOptions(result.data.map((d) => ({ value: d.id, label: d.name }))),
      )
      .catch(() => setOptions([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { options, isLoading };
}
