import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import Select from '@/shared/ui/Select';
import { roomApi } from '../api/roomApi';
import { toaster } from '@/components/ui/toaster';
import type { Room } from '../types/university.types';

const roomSchema = z.object({
  name: z.string().min(2, 'Room name is required'),
  capacity: z.coerce.number().min(1, 'Capacity must be at least 1'),
  type: z.enum(['CLASSROOM', 'LAB', 'AMPHITHEATER', 'MEETING_ROOM', 'OFFICE', 'OTHER']).optional(),
  building: z.string().optional(),
  floor: z.coerce.number().optional(),
  isActive: z.boolean().optional(),
});

type RoomFormValues = z.infer<typeof roomSchema>;

interface UpdateRoomFormProps {
  room: Room;
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateRoomForm = ({ room, onSuccess, onCancel }: UpdateRoomFormProps) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RoomFormValues>({
    resolver: zodResolver(roomSchema) as any,
    defaultValues: {
      name: room.name,
      capacity: room.capacity as any,
      type: room.type as any,
      building: room.building || '',
      floor: (room.floor ?? '') as any,
      isActive: room.isActive,
    },
  });

  const onSubmit = async (data: RoomFormValues) => {
    try {
      setIsSubmitting(true);
      await roomApi.updateRoom(room.id, data);
      toaster.create({
        title: 'Success',
        description: 'Room updated successfully.',
        type: 'success',
      });
      onSuccess();
    } catch (error: any) {
      toaster.create({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update room',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t("labels.room_name")}
          placeholder="e.g. A101"
          {...register('name')}
          error={errors.name?.message}
          required
        />
        <Select
          label={t("labels.room_type")}
          {...register('type')}
          error={errors.type?.message as string}
          options={[
            { value: 'CLASSROOM', label: t("labels.classroom") },
            { value: 'LAB', label: t("labels.laboratory") },
            { value: 'AMPHITHEATER', label: t("labels.amphitheater") },
            { value: 'MEETING_ROOM', label: t("labels.meeting_room") },
            { value: 'OFFICE', label: t("labels.office") },
            { value: 'OTHER', label: t("labels.other") },
          ]}
          required
        />
        <Input
          label={t("labels.capacity")}
          type="number"
          placeholder="e.g. 30"
          {...register('capacity')}
          error={errors.capacity?.message}
          required
        />
        <Input
          label={t("labels.building")}
          placeholder="e.g. Science Block"
          {...register('building')}
          error={errors.building?.message as string}
        />
        <Input
          label={t("labels.floor") || "Floor"}
          type="number"
          placeholder="e.g. 1"
          {...register('floor')}
          error={errors.floor?.message as string}
        />
        <div className="md:col-span-2 flex items-center gap-2 mt-2">
          <input 
            type="checkbox" 
            id="isActive" 
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            {...register('isActive')}
          />
          <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
            {t("global.is_active")}
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t mt-2">
        <Button type="button" buttonType="secondary" onClick={onCancel} disabled={isSubmitting}>
          {t("global.cancel")}
        </Button>
        <Button type="submit" buttonType="primary" disabled={isSubmitting} loading={isSubmitting}>
          {t("global.update_room")}
        </Button>
      </div>
    </form>
  );
};

export default UpdateRoomForm;
